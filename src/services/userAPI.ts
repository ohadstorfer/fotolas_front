// userAPI.ts
import axios from 'axios';

export function fetchUser(userId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/custom-users/${userId}/`;
  return axios.get(MY_SERVER);
}
