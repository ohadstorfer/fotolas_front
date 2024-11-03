import axios from 'axios';

export function signUp(credentials: { email: string, fullName: string, password: string }) {
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/custom-users/';
  return axios.post(MY_SERVER, credentials);
}
