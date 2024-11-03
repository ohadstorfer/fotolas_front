import axios from 'axios';

export function allSessAlbum(page: number = 1, pageSize: number = 21) {
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/session-albums-with-details/';
  return axios.get(MY_SERVER, {
    params: {
      page,
      page_size: pageSize,
    },
  });
}


export function sessById(session_album: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/session-albums-with-details-by-id/${session_album}/`;
  return axios.get(MY_SERVER);
}

export function sessAlbumsByPhotographer(photographerId: number, page: number = 1, pageSize: number = 21) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/session-albums-by-photographer/${photographerId}/`;
  return axios.get(MY_SERVER, {
    params: {
      page,
      page_size: pageSize,
    },
  });
}




export function sessAlbumsBySpot(spotId: number, page: number = 1, pageSize: number = 21) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/session-albums-by-spot/${spotId}/`;
  return axios.get(MY_SERVER, {
    params: {
      page,
      page_size: pageSize,
    },
  });
}




export function createSessAlbum(credentials: { sessDate: Date, spot: number, photographer: number, cover_image: string, videos: boolean }) {
  console.log(credentials);
  
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/session-albums/';
  return axios.post(MY_SERVER, credentials);
}




export function updatePrices(credentials: {session_album: number, price_1_to_5: number, price_6_to_50:number, price_51_plus:number  }) {
  console.log(credentials);
  
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/albums_prices/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePricesForVideos(credentials: {session_album: number, price_1_to_3: number, price_4_to_15: number, price_16_plus:number }) {
  console.log(credentials);
  
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/albums_prices-for-videos/';
  return axios.post(MY_SERVER, credentials);
}




export const deactivateSessionAlbum = async (sessionAlbumId: number): Promise<void> => {
  const url = `https://oyster-app-b3323.ondigitalocean.app/session-album/deactivate/${sessionAlbumId}/`;
  await axios.put(url);
};