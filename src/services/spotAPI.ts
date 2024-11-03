// spotAPI.ts
import axios from 'axios';

export function fetchSpot(spotId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/spots/${spotId}/`;
  return axios.get(MY_SERVER);
}


export function createSpot(credentials: { name: string, city: string, country: string }) {
  console.log(credentials);
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/spots/';
  return axios.post(MY_SERVER, credentials);
}


export function fetchAllSpots() {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/spots/`;
  return axios.get(MY_SERVER);
}