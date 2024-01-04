import axios from 'axios';

export function fetchImages(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/api/img/by_personal_album/${albumId}/`;
  return axios.get(MY_SERVER);
}
