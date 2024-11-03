// spotAPI.ts
import axios from 'axios';


export function lastAPI(credentials: { session_album_id: number, images_arrays: any}) {  
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/create_personal_albums_and_images/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePricesAPI(sessionAlbumId: number) {
  const updatePricesEndpoint = `https://9km-curious-mach.circumeo-apps.net/update-prices/${sessionAlbumId}/`;
  return axios.post(updatePricesEndpoint);
}