// photographerAPI.ts
import axios from 'axios';

export function PhotographerByUserId(userId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/photographer/by_user/${userId}/`;  
  return axios.get(MY_SERVER);
}
