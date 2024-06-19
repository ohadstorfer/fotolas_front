import axios from 'axios';

export function fetchwatermarked_photos(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/watermarked_photos/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchImages(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/images/${albumId}/`;
  return axios.get(MY_SERVER);
}