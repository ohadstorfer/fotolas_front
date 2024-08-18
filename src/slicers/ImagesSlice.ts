import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchImages, fetchImagesBySess, fetchVideosBySess, fetchwatermarked_photos } from '../services/ImagesAPI';

interface Img {
  id: number;
  photo: string;
  WatermarkedPhoto: string;
  price: number;
  personal_album: number;
  SessionAlbum: number;
}

interface Video {
  id: number;
  video: string;
  WatermarkedVideo: string;
  SessionAlbum: number;
}

interface imagesState {
  imgs: Img[];
  videos: Video[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  cart: number[]; // Array of album IDs in the cart
  cartTotalImages: number; // Total number of images in the cart
  cartTotalPrice: number;
  prices: any;
  error: string | null;
}


const initialCart = sessionStorage.getItem('cart');
const initialCartTotalImages = sessionStorage.getItem('cartTotalImages');
const initialCartTotalPrice = sessionStorage.getItem('cartTotalPrice');
const initialPrices = sessionStorage.getItem('prices');



const initialState: imagesState = {
  imgs: [],
  videos: [],
  cart: initialCart ? JSON.parse(initialCart) : [],
  cartTotalImages: initialCartTotalImages ? JSON.parse(initialCartTotalImages) : 0,
  cartTotalPrice: initialCartTotalPrice ? JSON.parse(initialCartTotalPrice) : 0,
  prices : initialPrices ? JSON.parse(initialPrices) : 0,
  status: 'idle',
  error: null,
};

export const resetImages = () => ({
  type: 'images/resetImages',
});

export const personalGetDataAsync = createAsyncThunk<Img[], number>('images/fetchwatermarked_photos', async (albumId: number) => {
  const response = await fetchwatermarked_photos(albumId);
  return response.data;
});

export const fetchImagesAsync = createAsyncThunk<Img[], number>('images/fetchImages', async (albumId: number) => {
  const response = await fetchImages(albumId);
  return response.data;
});

export const fetchImagesBySessAsync = createAsyncThunk<Img[], number>('images/fetchImages', async (albumId: number) => {
  const response = await fetchImagesBySess(albumId);
  return response.data;
});

export const fetchVideosBySessionAsync = createAsyncThunk<Video[], number>(
  'images/fetchVideosBySession',
  async (albumId: number) => {
    const response = await fetchVideosBySess(albumId)
    return response.data;
  }
);

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ imgId: number, imageCount: number }>) => {
      if (!state.cart.includes(action.payload.imgId)) {
        state.cart.push(action.payload.imgId);
        state.cartTotalImages += action.payload.imageCount;
        sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
        sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages)); // Save to session storage
      }
    },
    removeFromCart: (state, action: PayloadAction<{ imgId: number, imageCount: number }>) => {
      state.cart = state.cart.filter((id) => id !== action.payload.imgId);
      state.cartTotalImages -= action.payload.imageCount;
      sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
      sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages)); // Save to session storage
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.cartTotalPrice = action.payload;
      sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
    },
    setPrices: (state, action: PayloadAction<any>) => {
      state.prices = action.payload;
      sessionStorage.setItem('prices', JSON.stringify(state.prices)); // Save prices to session storage
    },
    resetImages: (state) => {
      state.imgs = [];
      state.videos = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(personalGetDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(personalGetDataAsync.fulfilled, (state, action: PayloadAction<Img[]>) => {
        state.imgs = action.payload;
        state.status = 'succeeded';
      })
      .addCase(personalGetDataAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch watermarked photos';
      })
      .addCase(fetchImagesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchImagesAsync.fulfilled, (state, action: PayloadAction<Img[]>) => {
        state.imgs = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchImagesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch images';
      })
      .addCase(fetchVideosBySessionAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVideosBySessionAsync.fulfilled, (state, action: PayloadAction<Video[]>) => {
        state.status = 'succeeded';
        state.videos = action.payload;
      })
      .addCase(fetchVideosBySessionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch videos by session';
      });
  },
});

export const selectImg = (state: { images: imagesState }) => state.images.imgs;
export const selectVideos = (state: { images: imagesState }) => state.images.videos;
export const selectCartTotalImages_IMAGES = (state: { images: imagesState }) => state.images.cartTotalImages;
export const selectCartTotalPrice_IMAGES = (state: { images: imagesState }) => state.images.cartTotalPrice;
export const selectPrices_IMAGES = (state: { images: imagesState }) => state.images.prices;
export const selectStatus = (state: { images: imagesState }) => state.images.status;
export const selectError = (state: { images: imagesState }) => state.images.error;


export default imagesSlice.reducer;
