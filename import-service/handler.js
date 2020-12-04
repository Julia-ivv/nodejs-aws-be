const S3 = require('aws-sdk/clients/s3');
const SQS = require('aws-sdk/clients/sqs');
const csv = require('csv-parser');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
};
const BUCKET = 'julia-ivv-stall-import';

module.exports = {
    importProductsFile: async (event) => {
        try {
            const s3 = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });
            const fileName = event.queryStringParameters.name;
            const params = {
                Bucket: BUCKET,
                Key: `uploaded/${fileName}`,
                Expires: 60,
                ContentType: 'text/csv'
            };
        
            return await new Promise((resolve, reject) => {
                s3.getSignedUrl('putObject', params, (error, url) => {
                    if (error) {
                        reject(new Error(error.message));
                    };
                    console.log('signed URL', url);
                    return resolve({
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(url),
                    });
                });
            });
        } catch(error) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal Server Error'}),
            }
        };
    },
    importFileParser: async (event, context, callback) => {
        try {
            const s3 = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });
            const sqs = new SQS();

            event.Records.forEach(async (record) => {
                const s3Stream = s3.getObject({
                    Bucket: BUCKET,
                    Key: record.s3.object.key,
                }).createReadStream();
                
                s3Stream.pipe(csv())
                .on('data', (data) => {
                    console.log(data);
                    sqs.sendMessage({
                        QueueUrl: process.env.SQS_URL,
                        MessageBody: JSON.stringify(data)
                    }, (error) => {
                        if (error) throw new Error(error.message);
                    })
                })
                .on('error', (error) => { throw new Error(error.message) })
                .on('end', async () => {
                    try {
                        await s3.copyObject({
                            Bucket: BUCKET,
                            CopySource: BUCKET + '/' + record.s3.object.key,
                            Key: record.s3.object.key.replace('uploaded', 'parsed')
                        }).promise();
                        await s3.deleteObject({
                            Bucket: BUCKET,
                            Key: record.s3.object.key
                        }).promise();
                    } catch(error) {
                        console.log('error', error);
                    };
                });
            }); 
            callback(null, {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        } catch(error) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal Server Error'}),
            }
        };
    }
}