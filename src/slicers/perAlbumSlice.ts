// perAlbumSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  fetchPersonalAlbums } from '../services/perAlbumAPI';


interface personalAlbum {
  sessAlbum: any;
  id: number;
  cover_image: string;
  price: number;
  session_album: number;
  user: number;
  image_count: number;
  
}

interface perAlbumState {
  albums: personalAlbum[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: perAlbumState = {
  albums: [],
  status: 'idle',
};

export const getDataAsync = createAsyncThunk<personalAlbum[], number>('perAlbum/fetchPersonalAlbums', async (albumId: number) => {
  const response = await fetchPersonalAlbums(albumId);
  return Array.isArray(response.data) ? response.data : [response.data];
});

export const perAlbumSlice = createSlice({
  name: 'perAlbum',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDataAsync.fulfilled, (state, action) => {
        // Update the albums with image_count property
        state.albums = action.payload.map(album => ({
          ...album,
          image_count: album.image_count,
        }));
        state.status = 'succeeded';
      });
  },
});

export const selectPersonalAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.albums;

export default perAlbumSlice.reducer;
