import axios from 'axios';
import { log } from 'console';
const API_BASE_URL = 'http://localhost:8000';

// Existing createPurchase function
export const createPurchase = async (purchaseData: { photographer: number, surfer: number, total_price: number, total_item_quantity: number, SessionAlbum: number | null }) => {
  console.log("createPurchase");
  return await axios.post(`${API_BASE_URL}/Purchases/`, purchaseData);
};

// Existing createPurchaseItem function
export const createPurchaseItem = async (purchaseItemData: { PurchaseId: number, Img: number }) => {
  return await axios.post(`${API_BASE_URL}/purchase-items/`, purchaseItemData);
};

// New function for creating a purchase with images
export const createPurchaseWithImages = async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, image_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-images/`, purchaseData);
};

// New function for creating a purchase with videos
export const createPurchaseWithVideos = async (purchaseData: {  photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, video_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-videos/`, purchaseData);
};

export const createPurchaseWithWaves = async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, wave_ids: number[] }) => {
  return await axios.post(`${API_BASE_URL}/create-purchase-with-waves/`, purchaseData);
};

export const fetchPurchaseCreated = async (purchaseId: number) => {
  const response = await axios.get(`http://localhost:8000/api/Purchases/${purchaseId}/`);
  return response.data.purchaseCreated;
};

export const fetchPurchaseItemCreated = async (purchaseItemId: number) => {
  const response = await axios.get(`http://localhost:8000/api/purchase-items/${purchaseItemId}/`);
  return response.data.purchaseItemCreated;
};

export const fetchPurchasesByPhotographer = async (photographerUserId: number) => {
  const response = await axios.get(`http://localhost:8000/api/purchases/photographer/${photographerUserId}/`);
  return response.data;
};

export const fetchPurchasesBySurfer = async (surferUserId: number) => {
  const response = await axios.get(`http://localhost:8000/api/purchases/surfer/${surferUserId}/`);
  return response.data;
};


export const fetchPurchasedItemsBySurfer = async (surferUserId: number) => {
  const response = await axios.get(`http://localhost:8000/purchased-items-by-surfer/${surferUserId}/`);
  console.log(response);
  
  return response.data;
};
