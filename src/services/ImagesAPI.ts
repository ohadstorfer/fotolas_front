import axios from 'axios';

export function fetchwatermarked_photos(albumId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/watermarked_photos/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchImages(albumId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/images/${albumId}/`;
  return axios.get(MY_SERVER);
}

// this one
export function fetchVideosBySess(albumId: number, page: number = 1) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/videos_by_seess/${albumId}/?page=${page}`;
  return axios.get(MY_SERVER);
}

export function fetchImagesBySess(albumId: number, page: number = 1) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/session_album/${albumId}/images/?page=${page}`;
  return axios.get(MY_SERVER);
}




export function fetchOriginalVideos(albumId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/videos/original/${albumId}/`;
  return axios.get(MY_SERVER);
}

export function fetchWatermarkedVideos(albumId: number) {
  const MY_SERVER = `https://oyster-app-b3323.ondigitalocean.app/videos/watermarked/${albumId}/`;
  return axios.get(MY_SERVER);
}


