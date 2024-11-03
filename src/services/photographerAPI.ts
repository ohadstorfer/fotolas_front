// photographerAPI.ts
import axios from 'axios';

export function fetchPhotographer(photographerId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/photographers/${photographerId}/`;
  return axios.get(MY_SERVER);
}
