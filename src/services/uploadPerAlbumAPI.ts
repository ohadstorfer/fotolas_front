// spotAPI.ts
import axios from 'axios';


export function lastAPI(credentials: { session_album_id: number, images_arrays: any}) {  
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/create_personal_albums_and_images/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePricesAPI(sessionAlbumId: number) {
  const updatePricesEndpoint = `https://oyster-app-b3323.ondigitalocean.app/update-prices/${sessionAlbumId}/`;
  return axios.post(updatePricesEndpoint);
}