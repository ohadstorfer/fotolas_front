import axios from 'axios';

export function allSessAlbum() {
   
  const MY_SERVER = 'http://127.0.0.1:8000/session-albums-with-details/';
  return axios.get(MY_SERVER);
}


export function sessAlbumsByPhotographer(photographerId: number) {

  const MY_SERVER = `http://127.0.0.1:8000/session-albums-by-photographer/${photographerId}/`;
  return axios.get(MY_SERVER);
}



export function sessAlbumsBySpot(spotId: number) {

  const MY_SERVER = `http://127.0.0.1:8000/session-albums-by-spot/${spotId}/`;
  return axios.get(MY_SERVER);
}