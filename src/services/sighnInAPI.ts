import axios from 'axios';

export function login(credentials: { email: string, password: string }) {
  const MY_SERVER = 'http://127.0.0.1:8000/api/token/';
  return axios.post(MY_SERVER, credentials);
}
