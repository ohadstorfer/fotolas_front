import axios from 'axios';
import { log } from 'console';
const API_BASE_URL = 'https://9km-curious-mach.circumeo-apps.net';

// Existing createPurchase function
export const createPurchase = async (purchaseData: { photographer: number, surfer: number, total_price: number, total_item_quantity: number, SessionAlbum: number | null }) => {
  console.log("createPurchase");
  return await axios.post(`${API_BASE_URL}/Purchases/`, purchaseData);
};

// Existing createPurchaseItem function
export const createPurchaseItem = async (purchaseItemData: { PurchaseId: number, Img: number }) => {
  return await axios.post(`${API_BASE_URL}/purchase-items/`, purchaseItemData);
};
// ******************************************************************************************************************************************************






// New function for creating a purchase with images
export const createPurchaseWithImages = async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string, photographer_name: string, surfer_name: string, image_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-images/`, purchaseData);
};

// New function for creating a purchase with videos
export const createPurchaseWithVideos = async (purchaseData: {  photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string, photographer_name: string, surfer_name: string, video_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-videos/`, purchaseData);
};

export const createPurchaseWithWaves = async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string, photographer_name: string, surfer_name: string, wave_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-waves/`, purchaseData);
};

export const fetchPurchaseCreated = async (purchaseId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/api/Purchases/${purchaseId}/`);
  return response.data.purchaseCreated;
};

export const fetchPurchaseItemCreated = async (purchaseItemId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/api/purchase-items/${purchaseItemId}/`);
  return response.data.purchaseItemCreated;
};

export const fetchPurchasesByPhotographer = async (photographerUserName: string) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/purchases/photographer/${photographerUserName}/`);
  console.log(response.data);
  
  return response.data;
};

export const fetchPurchasesBySurfer = async (surferUserId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/api/purchases/surfer/${surferUserId}/`);
  return response.data;
};


export const fetchPurchasedItemsBySurfer = async (surferUserId: number) => {
  const response = await axios.get(`https://9km-curious-mach.circumeo-apps.net/purchased-items-by-surfer/${surferUserId}/`);
  console.log(response);
  
  return response.data;
};
