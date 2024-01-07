// photographerAPI.ts
import axios from 'axios';

export function fetchPhotographer(photographerId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/photographers/${photographerId}/`;
  return axios.get(MY_SERVER);
}
