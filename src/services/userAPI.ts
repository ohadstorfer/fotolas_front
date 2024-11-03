// userAPI.ts
import axios from 'axios';

export function fetchUser(userId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/custom-users/${userId}/`;
  return axios.get(MY_SERVER);
}