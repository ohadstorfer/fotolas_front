import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createPurchase, createPurchaseItem, createPurchaseWithImages, createPurchaseWithVideos, createPurchaseWithWaves, fetchPurchasedItemsBySurfer, fetchPurchasesByPhotographer, fetchPurchasesBySurfer } from '../services/purchasesAPI';

interface PurchaseState {
  purchaseCreated: boolean;
  purchaseItemCreated: boolean;
  photographerPurchases: purchase[];
  surferPurchases: any;
  purchasedImages: {};
  purchasedVideos: {};
  error: string | null;
}


interface purchase {
  id: number;
  order_date: Date;
  photographer: number;
  surfer: number;
  total_price: number;
  total_item_quantity: number;
  SessionAlbum: number;
  sessDate: Date;
  spot_name: string;
  photographer_name: string;
  surfer_name: string;
}

interface purchaseItem {
  id: number;
  PurchaseId: number;
  Img: number;
  Video: number;
  days_until_expiration: number;
}


const initialState: PurchaseState = {
  purchaseCreated: false,
  purchaseItemCreated: false,
  photographerPurchases: [],
  // surferPurchases: {},
  error: null,
  purchasedImages: {},
  purchasedVideos: {},
  surferPurchases: {
    purchased_images: {},
    purchased_videos: {},
  },
};



export const createPurchaseWithImagesAsync = createAsyncThunk(
  'purchase/createWithImages',
  async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string ,photographer_name: string, surfer_name: string,  image_ids: number[] }) => {
    const response = await createPurchaseWithImages(purchaseData);
    return response.data;
  }
);

export const createPurchaseWithVideosAsync = createAsyncThunk(
  'purchase/createWithVideos',
  async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string, photographer_name: string, surfer_name: string, video_ids: number[] }) => {
    console.log(purchaseData.video_ids);
    
    const response = await createPurchaseWithVideos(purchaseData);
    return response.data;
  }
);

export const createPurchaseWithWavesAsync = createAsyncThunk(
  'purchase/createWithWaves',
  async (purchaseData: { photographer_id: number, surfer_id: number, total_price: number, total_item_quantity: number, session_album_id: number | null, sessDate:Date, spot_name: string, photographer_name: string, surfer_name: string, wave_ids: number[] }) => {
    const response = await createPurchaseWithWaves(purchaseData);
    return response.data;
  }
);



export const createPurchaseAsync = createAsyncThunk(
  'purchase/create',
  async (purchaseData: { photographer: number, surfer: number, total_price: number, total_item_quantity: number, SessionAlbum: number | null }) => {
    const response = await createPurchase(purchaseData);
    return response.data;
  }
);

export const createPurchaseItemAsync = createAsyncThunk(
  'purchaseItem/create',
  async (purchaseItemData: { PurchaseId: number, Img: number}) => {
    console.log("from the slicer: " , purchaseItemData);

    const response = await createPurchaseItem(purchaseItemData);
    return response.data;
  }
);

export const fetchPhotographerPurchasesAsync = createAsyncThunk(
  'purchase/fetchByPhotographer',
  async (photographerUserName: string) => {
    const response = await fetchPurchasesByPhotographer(photographerUserName);
    return response;
  }
);

// this is not relavent
export const fetchSurferPurchasesAsync = createAsyncThunk(
  'purchase/fetchBySurfer',
  async (surferUserId: number) => {
    const response = await fetchPurchasesBySurfer(surferUserId);
    return response.data;
  }
);


export const fetchSurferPurchasedItemsAsync = createAsyncThunk(
  'purchasedItems/fetchBySurfer',
  async (surferUserId: number) => {
    const response = await fetchPurchasedItemsBySurfer(surferUserId);    
    return response;
  }
);


const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPurchaseAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createPurchaseAsync.fulfilled, (state) => {
        state.purchaseCreated = true;
        state.error = null;
      })
      .addCase(createPurchaseAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(createPurchaseItemAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createPurchaseItemAsync.fulfilled, (state) => {
        state.purchaseItemCreated = true;
        state.error = null;
      })
      .addCase(createPurchaseItemAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(createPurchaseWithImagesAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createPurchaseWithImagesAsync.fulfilled, (state) => {
        state.purchaseCreated = true;
        state.error = null;
      })
      .addCase(createPurchaseWithImagesAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(createPurchaseWithVideosAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createPurchaseWithVideosAsync.fulfilled, (state) => {
        state.purchaseCreated = true;
        state.error = null;
      })
      .addCase(createPurchaseWithVideosAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchPhotographerPurchasesAsync.fulfilled, (state, action) => {
        state.photographerPurchases = action.payload;
        console.log(state.photographerPurchases);
        
      })
      .addCase(fetchSurferPurchasesAsync.fulfilled, (state, action) => {
        state.surferPurchases = action.payload;
      })
      .addCase(fetchSurferPurchasedItemsAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSurferPurchasedItemsAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.surferPurchases = action.payload;
        state.purchasedImages = action.payload.purchased_images;
        state.purchasedVideos = action.payload.purchased_videos;
        console.log("state.surferPurchases: " , state.surferPurchases);
        console.log("state.purchasedImages: " , state.purchasedImages);
        console.log("state.purchasedVideos: " , state.purchasedVideos);
        state.error = null;
      })
      .addCase(fetchSurferPurchasedItemsAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const selectPurchaseCreated = (state: { purchase: PurchaseState }) => state.purchase.purchaseCreated;
export const selectPurchaseItemCreated = (state: { purchase: PurchaseState }) => state.purchase.purchaseItemCreated;
export const selectPhotographerPurchases = (state: { purchase: PurchaseState }) => state.purchase.photographerPurchases;
export const selectSurferPurchases = (state: { purchase: PurchaseState }) => state.purchase.surferPurchases;
export const selectPurchasedImages = (state: { purchase: PurchaseState }) => state.purchase.purchasedImages;


export default purchaseSlice.reducer;
