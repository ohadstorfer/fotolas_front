import axios from 'axios';

export function signUp(credentials: { email: string, fullName: string, password: string }) {
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/custom-users/';
  return axios.post(MY_SERVER, credentials);
}
