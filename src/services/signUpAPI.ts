import axios from 'axios';

export function signUp(credentials: { email: string, fullName: string, password: string }) {
  const MY_SERVER = 'http://127.0.0.1:8000/custom-users/';
  return axios.post(MY_SERVER, credentials);
}
