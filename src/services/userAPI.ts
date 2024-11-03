// userAPI.ts
import axios from 'axios';

export function fetchUser(userId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/custom-users/${userId}/`;
  return axios.get(MY_SERVER);
}