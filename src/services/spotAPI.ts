// spotAPI.ts
import axios from 'axios';

export function fetchSpot(spotId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/spots/${spotId}/`;
  return axios.get(MY_SERVER);
}


export function createSpot(credentials: { name: string, city: string, country: string }) {
  console.log(credentials);
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/spots/';
  return axios.post(MY_SERVER, credentials);
}


export function fetchAllSpots() {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/spots/`;
  return axios.get(MY_SERVER);
}