import { headers } from './headers';

export const unauthorizedError = {
    statusCode: 401,
    headers: headers,
    body: JSON.stringify({message: 'Unauthorized'})
};
