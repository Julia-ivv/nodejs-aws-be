import productList from './productList.json';
import { headers } from '../constants/headers';

export const getProductsById = async event => {
  const { productId } = event.pathParameters;
  try {
    if (productId > productList.length - 1) throw new Error();

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(productList[productId]),
    };
  }
  catch(error) {
    return {
        statusCode: 404,
        body: JSON.stringify({message: "Product is not found"}),
    }
  }
};
