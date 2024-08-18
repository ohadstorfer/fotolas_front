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




export function createSessAlbum(credentials: { sessDate: Date, spot: number, photographer: number, cover_image: string, videos: boolean }) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/session-albums/';
  return axios.post(MY_SERVER, credentials);
}




export function updatePrices(credentials: {session_album: number, price_1_to_5: number, price_6_to_20: number, price_21_to_50:number, price_51_plus:number  }) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/albums_prices/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePricesForVideos(credentials: {session_album: number, price_1_to_5: number, price_6_to_15: number, price_16_plus:number }) {
  console.log(credentials);
  
  const MY_SERVER = 'http://127.0.0.1:8000/albums_prices-for-videos/';
  return axios.post(MY_SERVER, credentials);
}