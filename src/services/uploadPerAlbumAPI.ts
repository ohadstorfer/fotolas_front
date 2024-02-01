// spotAPI.ts
import axios from 'axios';


export function lastAPI(credentials: { session_album_id: number, images_arrays: any}) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/create_personal_albums_and_images/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePricesAPI(sessionAlbumId: number) {
  const updatePricesEndpoint = `http://127.0.0.1:8000/update_prices/${sessionAlbumId}/`;
  return axios.post(updatePricesEndpoint);
}