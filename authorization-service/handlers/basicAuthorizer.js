import { unauthorizedError } from '../constants/errors';

const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
};

export const basicAuthorizer = async (event) => {
    if (event['type'] != 'TOKEN') return unauthorizedError; 

    try {
        const authToken = event.authorizationToken;
        const encodedCreds = authToken.split(' ')[1];
        const creds = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
        const userName = creds[0];
        const pwd = creds[1];
        const envPwd = process.env[userName];
        const effect = !envPwd || envPwd != pwd ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        return policy;
    } catch(err) {
        return unauthorizedError;
    };
}