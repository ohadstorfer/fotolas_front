import axios from 'axios';

export function becomePhotographer(credentials: { user: number, about: string,  profile_image: string  }) {
  console.log(credentials);
  
  const MY_SERVER = 'https://9km-curious-mach.circumeo-apps.net/photographers/';
  return axios.post(MY_SERVER, credentials);
}



export function updatePhotographer(credentials: { photographerId: number, user: number, about: string, profile_image: string }) {
  console.log(credentials);
  
  const { photographerId, ...updateData } = credentials; // Extract the ID from the credentials
  
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/photographers/${photographerId}/`;
  
  return axios.put(MY_SERVER, updateData);
}





export function updateDefaultAlbumPricesForImages(credentials: { photographer: number, price_1_to_5: number, price_6_to_50: number, price_51_plus: number }) {
  console.log(credentials);
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/default-album-prices-update/images/photographer/${credentials.photographer}/`;
  console.log(credentials);
  return axios.put(MY_SERVER, credentials);
}



export function updateDefaultAlbumPricesForVideos(credentials: { photographer: number, price_1_to_3: number, price_4_to_15: number, price_16_plus: number }) {
  const MY_SERVER = `https://9km-curious-mach.circumeo-apps.net/default-album-prices-update/videos/${credentials.photographer}/`;
  console.log(credentials);
  return axios.put(MY_SERVER, credentials);
}



export const fetchDefaultPricesForImages = async (photographerId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/default-album-prices/images/photographer/${photographerId}/`);
  return response.data;
};

export const fetchDefaultPricesForVideos = async (photographerId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/default-album-prices/videos/photographer/${photographerId}/`);
  return response.data;
};