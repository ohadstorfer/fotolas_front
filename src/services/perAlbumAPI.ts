import axios from 'axios';

// export function fetchPersonalAlbums(albumId: number) {
   
//   const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/waves/${albumId}/`;
//   return axios.get(MY_SERVER);
// }

export function fetchPersonalAlbums(albumId: number, page: number, pageSize: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/waves/${albumId}/?page=${page}&page_size=${pageSize}`;
  return axios.get(MY_SERVER);
}



export function getPricesBySess(albumId: number) {
   
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/albums-prices-by-sess/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function getPricesForVideosBySess(albumId: number) {
   
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/albums-prices-for-videos-by-sess/${albumId}/`;
  return axios.get(MY_SERVER);
}



// Function to fetch waves by a list of wave IDs
export function fetchWavesByList(waveIds: number[]) {
  
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/api/get_waves/`;
  return axios.post(MY_SERVER, { waveIds });
}




export function createPerAlbum(credentials: { session_album: number, cover_image: string}) {
  console.log(credentials);
  
  const MY_SERVER = 'https://oyster-app-b3323.ondigitalocean.app/personal-albums/';
  return axios.post(MY_SERVER, credentials);
}

