import productList from './productList.json'

export const getProductsList = async event => {
  try {
    return {
        statusCode: 200,
        headers: {
            // "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
        },
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
