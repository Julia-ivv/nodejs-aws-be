import AWS from 'aws-sdk';
import { Client } from 'pg';
import { dbOptions } from '../constants/dbOptions';
import { headers } from '../constants/headers';
import { isValid } from '../utils/productValidation';

export const catalogBatchProcess = async event => {
    const sns = new AWS.SNS({ region: 'eu-west-1' });
    const client = new Client(dbOptions);
    await client.connect();

    try {
        let allProducts = event.Records.map(({body}) => {
            const { title, description, price, image, count } = JSON.parse(body);

            if (!isValid(title, description, price, image, count)) {
                console.log('data validation failed', title, description, price, image, count);
                return { title, error: 'data validation failed' }
            } else {
                return JSON.parse(body);
            };
        });

        allProducts = allProducts.filter((elem) => {
            return !(elem.error);
        });
        
        if (allProducts.length > 0) {
            await client.query('BEGIN');
            let requestString = `
                insert into products (title, description, price, image) values
                ${allProducts.map(product => `('${product.title}', '${product.description}', ${product.price}, '${product.image}')`).join(',')}
                returning id;
            `;
            const newProduct = await client.query(requestString);
            console.log('requestString', requestString);
            
            requestString = `
                insert into stocks (product_id, count) values
                ${newProduct.rows.map((elem, index) => `('${elem.id}', ${allProducts[index].count})`).join(', ')};
            `;
            console.log('requestString', requestString);
            const newStock = await client.query(requestString);
            
            await client.query('COMMIT');
        };
      
        allProducts.forEach(async (elem) => {
            console.log('elem', elem);
            console.log('sns-arn', process.env.SNS_ARN);
            const publishText = await sns.publish({
                Subject: 'Product added to database',
                Message: JSON.stringify(elem),
                TopicArn: process.env.SNS_ARN
            //}//, async (err, data) => {
             //   if (err) console.log('error', err)
             //   else console.log('success', data);
            }).promise();
            // publishText
            //     .then((data) => console.log("Sent message: "))
            //     .catch((err) => console.log('error', err));
        });
        // return {
        //     statusCode: 200,
        //     headers: headers,
        //     body: JSON.stringify({message: 'Completed successfully'}),
        // };             
    } catch(error) {
        await client.query('ROLLBACK');
        console.log('error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal Server Error'}),
        }
    } finally {
        await client.end();
    };
};