import productList from './productList.json';
import { headers } from '../constants/headers';

export const getProductsList = async event => {
  try {
    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(productList),
    };
  }
  catch(error) {
    return {
        statusCode: 400,
        body: JSON.stringify({message: "Bad request"}),
    }
  }
};
