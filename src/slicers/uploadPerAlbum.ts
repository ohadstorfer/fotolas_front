// uploadAlbumSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { lastAPI } from '../services/uploadPerAlbumAPI';
import { updatePricesAPI } from '../services/uploadPerAlbumAPI'; // Import the new API function

interface UploadAlbumState {
  albums: string[][];
  prices:{} | null
  yalla: boolean;
  status: boolean;
  finish: boolean;
}

const initialState: UploadAlbumState = {
  albums: [],
  yalla: false,
  status: false,
  prices:null,
  finish: false
};

export const lastAPIAsync = createAsyncThunk('lastAPI', async (credentials: { session_album_id: number, images_arrays: any }) => {
  const response = await lastAPI(credentials);
  return response.data; 
});

// Add a new async thunk to update prices after the previous API call
export const updatePricesAsync = createAsyncThunk('updatePrices', async (sessionAlbumId: number) => {
  await updatePricesAPI(sessionAlbumId);
});

export const uploadAlbum = createSlice({
  name: 'UploadAlbum',
  initialState,
  reducers: {
    updateAlbums: (state, action: PayloadAction<string[]>) => {
      state.albums.push(action.payload);
      state.yalla = false;
    },
    setYallaTrue: (state) => {
      state.yalla = true;
    },
    // Other reducers...
  },
  extraReducers: (builder) => {
    builder.addCase(lastAPIAsync.fulfilled, (state, action) => {
      state.status = true
    });

    builder.addCase(lastAPIAsync.rejected, (state, action) => {
      console.error('API call failed');
    });

    builder.addCase(updatePricesAsync.fulfilled, (state, action) => {
      console.log('Update prices successful');
      state.finish = true
    });

    builder.addCase(updatePricesAsync.rejected, (state, action) => {
      console.error('Update prices failed');
    });
  },
});

export const { updateAlbums, setYallaTrue } = uploadAlbum.actions;

export const selectAlbums = (state: { uploadAlbum: UploadAlbumState }) => state.uploadAlbum.albums;
export const selectYalla = (state: { uploadAlbum: UploadAlbumState }) => state.uploadAlbum.yalla;
export const selectStatus = (state: { uploadAlbum: UploadAlbumState }) => state.uploadAlbum.status;
export const selectFinish = (state: { uploadAlbum: UploadAlbumState }) => state.uploadAlbum.finish;

export default uploadAlbum.reducer;
