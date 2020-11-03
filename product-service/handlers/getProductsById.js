import productList from './productList.json';
import { headers } from '../constants/headers';
import { getProductById } from '../utils/getProductById';

export const getProductsById = async event => {
  const { productId } = event.pathParameters;
  try {
    if (productId > productList.length - 1) throw new Error();
    // const product = productList.find((product) => product.id === productId);
    const product = await getProductById(productId);
    if (!product) throw new Error();

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(product),
    };
  }
  catch(error) {
    return {
        statusCode: 404,
        body: JSON.stringify({message: "Product is not found"}),
    }
  }
};
