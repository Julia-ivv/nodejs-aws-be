import { Client } from 'pg';
import Joi from 'joi';
import { dbOptions } from '../constants/dbOptions';
import { headers } from '../constants/headers';

function isValid(title, description, price, image, count) {

    const schema = Joi.object({
        title: Joi.string().alphanum().required(),
        description: Joi.string().alphanum().required(),
        price: Joi.number().required(),
        image: Joi.string()
        .regex(/^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?\/?([-0-9/a-zA-Z&=?+%._]+#?)?$/),
        count: Joi.number().required()
    });

    const { error } = schema.validate({ title, description, price, image, count });
    if (!error) return true
    else return false;
}

export const postProduct = async event => {
    const { title, description, price, image, count } = JSON.parse(event.body);
    const client = new Client(dbOptions);
    console.log('Lambda postProduct invocation with:', event)

    if (!isValid(title, description, price, image, count)) {
        console.log('Lambda postProduct data validation failed');
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({message: "Bad Request"}),
        };
    };

    await client.connect();
    try {
        await client.query('BEGIN');
        let requestString = 
            `insert into products (title, description, price, image) values
            ('${title}', '${description}', ${price}, '${image}')
            returning id`;
        const newProduct = await client.query(requestString);
        console.log(requestString);
        
        requestString =  `insert into stocks (product_id, count) values
                        ('${newProduct.rows[0].id}', ${count})`;
        const newStock = await client.query(requestString);
        console.log(requestString);
        
        await client.query('COMMIT');
        console.log('Lambda postProduct execution successfully finished');
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({message: "Completed successfully"}),
        };
    }
    catch(error) {
        await client.query('ROLLBACK');
        console.log('Lambda postProduct execution failed with error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Internal Server Error"}),
            // body: JSON.stringify(error),
        }
    }
    finally {
        client.end();
    };
}