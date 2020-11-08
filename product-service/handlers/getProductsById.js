import validator from 'validator';
import { Client } from 'pg';
import { dbOptions } from '../constants/dbOptions';
import { headers } from '../constants/headers';

export const getProductsById = async event => {
  const { productId } = event.pathParameters;
  const client = new Client(dbOptions);

  if (!validator.isUUID(productId)) 
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({message: "Bad Request"}),
    };

  await client.connect();
  try {
    // if (!product) throw new Error();

    const requestString = 
      `select p.id, p.title, p.description, p.price, p.image, s.count 
      from products p 
      inner join stocks s 
      on p.id = s.product_id 
      where p.id = '${productId}'`;
    const product = await client.query(requestString);
    console.log(requestString);

    if (product.rowCount === 0) 
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({message: "Product is not found"}),
    };

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(product.rows),
    };
  }
  catch(error) {
    return {
        statusCode: 500,
        body: JSON.stringify({message: "Internal Server Error"}),
    }
  }
  finally {
    client.end();
  }
};
