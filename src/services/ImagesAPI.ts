import axios from 'axios';

export function fetchwatermarked_photos(albumId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/watermarked_photos/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchImages(albumId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/images/${albumId}/`;
  return axios.get(MY_SERVER);
}

// this one
export function fetchVideosBySess(albumId: number, page: number = 1) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/videos_by_seess/${albumId}/?page=${page}`;
  return axios.get(MY_SERVER);
}

export function fetchImagesBySess(albumId: number, page: number = 1) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/session_album/${albumId}/images/?page=${page}`;
  return axios.get(MY_SERVER);
}




export function fetchOriginalVideos(albumId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/videos/original/${albumId}/`;
  return axios.get(MY_SERVER);
}

export function fetchWatermarkedVideos(albumId: number) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/videos/watermarked/${albumId}/`;
  return axios.get(MY_SERVER);
}


