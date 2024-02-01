// perAlbumSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  createPerAlbum, fetchPersonalAlbums } from '../services/perAlbumAPI';


interface personalAlbum {
  sessAlbum: any;
  id: number;
  cover_image: string;
  price: number;
  session_album: number;
  image_count: number;
  
}

interface perAlbumState {
  albums: personalAlbum[];
  newPerAlbum: personalAlbum | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: perAlbumState = {
  albums: [],
  newPerAlbum: null,
  status: 'idle',
};

export const getDataAsync = createAsyncThunk<personalAlbum[], number>('perAlbum/fetchPersonalAlbums', async (albumId: number) => {
  const response = await fetchPersonalAlbums(albumId);
  return Array.isArray(response.data) ? response.data : [response.data];
});


export const createPerAlbumAsync = createAsyncThunk('createPerAlbum', async (credentials: { session_album: number, cover_image: string  }) => {
  console.log("createPerAlbum asynchronously");
  const response = await createPerAlbum(credentials);
  return response.data; 
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
      })
      .addCase(createPerAlbumAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createPerAlbumAsync.fulfilled, (state, action) => {
        state.newPerAlbum = action.payload.id;
        console.log(state.newPerAlbum);
        
        state.status = 'succeeded';
      })
      

  },
});

export const selectPersonalAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.albums;

export const selectNewPerAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.newPerAlbum;

export default perAlbumSlice.reducer;
