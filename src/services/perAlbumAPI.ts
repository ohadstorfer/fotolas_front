import axios from 'axios';

export function fetchPersonalAlbums(albumId: number) {
   
  const MY_SERVER = `http://127.0.0.1:8000/waves/${albumId}/`;
  return axios.get(MY_SERVER);
}





export function createPerAlbum(credentials: { session_album: number, cover_image: string}) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/personal-albums/';
  return axios.post(MY_SERVER, credentials);
}

