// photographerAPI.ts
import axios from 'axios';

export function fetchPhotographer(photographerId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/photographers/${photographerId}/`;
  return axios.get(MY_SERVER);
}
