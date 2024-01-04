import axios from 'axios';

export function fetchProducts() {
  const MY_SERVER = 'http://localhost:3005/products';
  return axios.get(MY_SERVER);
}
