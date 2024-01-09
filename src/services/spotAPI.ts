// spotAPI.ts
import axios from 'axios';

export function fetchSpot(spotId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/spots/${spotId}/`;
  return axios.get(MY_SERVER);
}
