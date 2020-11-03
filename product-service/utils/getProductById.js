import productList from '../handlers/productList.json';

export const getProductById = (id) => Promise.resolve(productList.find((product) => product.id === id));