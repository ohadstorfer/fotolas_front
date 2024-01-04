import axios from 'axios';

export function fetchPersonalAlbums(albumId: number) {
   
  const MY_SERVER = `http://127.0.0.1:8000/personal-albums-by-sess/${albumId}/`;
  return axios.get(MY_SERVER);
}


