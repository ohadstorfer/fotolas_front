// imagesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchImages } from '../services/ImagesAPI';

interface Img {
  cover_image: string | undefined;
  id: number;
  photo: string;
  price: number;
  personal_album: number;
}

interface imagesState {
  imgs: Img[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: imagesState = {
  imgs: [],
  status: 'idle',
};


export const resetImages = () => ({
  type: 'images/resetImages',
});


export const personalGetDataAsync = createAsyncThunk<Img[], number>('images/fetchImages', async (albumId: number) => {
    console.log("trying");
    
  const response = await fetchImages(albumId);
  return response.data;
});



export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: { resetImages: (state) => {
    state.imgs = [];
    state.status = 'idle';
  },},
  extraReducers: (builder) => {
    builder
      .addCase(personalGetDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(personalGetDataAsync.fulfilled, (state, action) => {
        state.imgs = action.payload;
        state.status = 'succeeded';
      })
  },
});

export const selectImg = (state: { images: imagesState }) => state.images.imgs;

export default imagesSlice.reducer;
