import productList from './productList.json'

export const getProductsById = async event => {
  const { productId } = event.pathParameters;
  try {
    if (productId > productList.length - 1) throw new Error();

    return {
        statusCode: 200,
        headers: {
            // "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
        },
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
