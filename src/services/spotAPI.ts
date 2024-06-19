// spotAPI.ts
import axios from 'axios';

export function fetchSpot(spotId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/spots/${spotId}/`;
  return axios.get(MY_SERVER);
}


export function createSpot(credentials: { name: string, city: string, country: string }) {
  console.log(credentials);
  const MY_SERVER = 'http://127.0.0.1:8000/spots/';
  return axios.post(MY_SERVER, credentials);
}


export function fetchAllSpots() {
  const MY_SERVER = `http://127.0.0.1:8000/spots/`;
  return axios.get(MY_SERVER);
}