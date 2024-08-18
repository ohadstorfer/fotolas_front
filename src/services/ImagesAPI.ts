import axios from 'axios';

export function fetchwatermarked_photos(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/watermarked_photos/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchImages(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/images/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchImagesBySess(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/session_album/${albumId}/images/`;
  return axios.get(MY_SERVER);
}






export function fetchOriginalVideos(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/videos/original/${albumId}/`;
  return axios.get(MY_SERVER);
}

export function fetchWatermarkedVideos(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/videos/watermarked/${albumId}/`;
  return axios.get(MY_SERVER);
}


export function fetchVideosBySess(albumId: number) {
  const MY_SERVER = `http://127.0.0.1:8000/videos_by_seess/${albumId}/`;
  return axios.get(MY_SERVER);
}