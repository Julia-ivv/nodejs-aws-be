import { Client } from 'pg';
import { headers } from '../constants/headers';

import { dbOptions } from '../constants/dbOptions';

export const getProductsList = async event => {
  const client = new Client(dbOptions);
  console.log('Lambda getProductsList invocation with:', event);
  await client.connect();
  try {
    const requestString =
      `select p.id, p.title, p.description, p.price, p.image, s.count 
      from products p 
      left join stocks s 
      on p.id = s.product_id`;
    const productList = await client.query(requestString);
    console.log(requestString);

    console.log('Lambda getProductsList execution successfully finished');
    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(productList.rows),
    };
  }
  catch(error) {
    console.log('Lambda getProductsList execution failed with error', error);
    return {
        statusCode: 500,
        body: JSON.stringify({message: "Internal Server Error"}),
    }
  }
  finally {
    await client.end();
  }
};
