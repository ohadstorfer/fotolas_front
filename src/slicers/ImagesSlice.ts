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
  cart: number[];
  cartTotalImages: number;
  cartTotalPrice: number;
  prices: any;
  error: string | null;
  nextImages: string | null;
  previousImages: string | null;
  nextVideos: string | null;
  previousVideos: string | null;
  total_pages_Images: number | null;
  total_pages_Videos: number | null;
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
  nextImages: null,
  previousImages: null,
  nextVideos: null,
  previousVideos: null,
  total_pages_Images: null,
  total_pages_Videos: null,
  error: null,
};

// export const resetImages = () => ({
//   type: 'images/resetImages',
// });

export const personalGetDataAsync = createAsyncThunk<Img[], number>('images/fetchwatermarked_photos', async (albumId: number) => {
  const response = await fetchwatermarked_photos(albumId);
  return response.data;
});

export const fetchImagesAsync = createAsyncThunk<Img[], number>('images/fetchImages', async (albumId: number) => {
  const response = await fetchImages(albumId);
  return response.data;
});

export const fetchImagesBySessAsync = createAsyncThunk<
  { images: Img[]; next: string | null; previous: string | null; total_pages_Images: number | null },
  { albumId: number; page?: number }
>('images/fetchImagesBySess', async ({ albumId, page = 1 }) => {
  const response = await fetchImagesBySess(albumId, page);
  return {
    images: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    total_pages_Images: response.data.total_pages,
  };
});

export const fetchVideosBySessionAsync = createAsyncThunk<
  { videos: Video[]; next: string | null; previous: string | null; total_pages_Videos: number | null },
  { albumId: number; page?: number }
>('images/fetchVideosBySession', async ({ albumId, page = 1 }) => {
  const response = await fetchVideosBySess(albumId, page);
  return {
    videos: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    total_pages_Videos: response.data.total_pages,
  };
});

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ imgId: number; imageCount: number }>) => {
      if (!state.cart.includes(action.payload.imgId)) {
        state.cart.push(action.payload.imgId);
        state.cartTotalImages += action.payload.imageCount;
        sessionStorage.setItem('cart', JSON.stringify(state.cart));
        sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages));
      }
    },
    removeFromCart: (state, action: PayloadAction<{ imgId: number; imageCount: number }>) => {
      state.cart = state.cart.filter((id) => id !== action.payload.imgId);
      state.cartTotalImages -= action.payload.imageCount;
      sessionStorage.setItem('cart', JSON.stringify(state.cart));
      sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages));
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.cartTotalPrice = action.payload;
      sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
    },
    setPrices: (state, action: PayloadAction<any>) => {
      state.prices = action.payload;
      sessionStorage.setItem('prices', JSON.stringify(state.prices));
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
      .addCase(fetchImagesBySessAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchImagesBySessAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.imgs = action.payload.images;
        state.nextImages = action.payload.next;
        state.previousImages = action.payload.previous;
        state.total_pages_Images = action.payload.total_pages_Images;
      })
      .addCase(fetchImagesBySessAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch images by session';
      })
      .addCase(fetchVideosBySessionAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVideosBySessionAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload.videos;
        state.nextVideos = action.payload.next;
        state.previousVideos = action.payload.previous;
        state.total_pages_Videos = action.payload.total_pages_Videos;
        console.log(state.total_pages_Videos);
        
      })
      .addCase(fetchVideosBySessionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch videos by session';
      });
  },
});




export const { resetImages } = imagesSlice.actions;



export const selectImg = (state: { images: imagesState }) => state.images.imgs;
export const selectVideos = (state: { images: imagesState }) => state.images.videos;
export const selectCartTotalImages_IMAGES = (state: { images: imagesState }) => state.images.cartTotalImages;
export const selectCartTotalPrice_IMAGES = (state: { images: imagesState }) => state.images.cartTotalPrice;
export const selectPrices_IMAGES = (state: { images: imagesState }) => state.images.prices;
export const selectStatus = (state: { images: imagesState }) => state.images.status;
export const selectError = (state: { images: imagesState }) => state.images.error;
export const selectNextImages = (state: { images: imagesState }) => state.images.nextImages;
export const selectPreviousImages = (state: { images: imagesState }) => state.images.previousImages;
export const selectNextVideos = (state: { images: imagesState }) => state.images.nextVideos;
export const selectPreviousVideos = (state: { images: imagesState }) => state.images.previousVideos;
export const select_total_pages_Videos = (state: { images: imagesState }) => state.images.total_pages_Videos;
export const select_total_pages_Images = (state: { images: imagesState }) => state.images.total_pages_Images;

export default imagesSlice.reducer;
