// uploadAlbumSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { lastAPI } from '../services/uploadPerAlbumAPI';
import { updatePricesAPI } from '../services/uploadPerAlbumAPI'; // Import the new API function

interface UploadAlbumState {
  albums: string[][];
  prices:{} | null
  yalla: boolean;
  status: number | null;
}

const initialState: UploadAlbumState = {
  albums: [],
  yalla: false,
  status: null,
  prices:null
};

export const lastAPIAsync = createAsyncThunk('lastAPI', async (credentials: { session_album_id: number, images_arrays: any }) => {
  console.log("Creating perAlbum and images asynchronously");
  const response = await lastAPI(credentials);
  return response.data; 
});

// Add a new async thunk to update prices after the previous API call
export const updatePricesAsync = createAsyncThunk('updatePrices', async (sessionAlbumId: number) => {
  console.log("Updating prices asynchronously ny the sessId: " , sessionAlbumId);
  await updatePricesAPI(sessionAlbumId);
});

export const uploadAlbum = createSlice({
  name: 'UploadAlbum',
  initialState,
  reducers: {
    updateAlbums: (state, action: PayloadAction<string[]>) => {
      state.albums.push(action.payload);
      console.log('Updated Albums:', state.albums);
      state.yalla = false;
    },
    setYallaTrue: (state) => {
      state.yalla = true;
    },
    // Other reducers...
  },
  extraReducers: (builder) => {
    builder.addCase(lastAPIAsync.fulfilled, (state, action) => {
      state.status = action.payload.session_album_id
      // Dispatch the new thunk action to update prices
    });

    builder.addCase(lastAPIAsync.rejected, (state, action) => {
      console.error('API call failed');
    });

    builder.addCase(updatePricesAsync.fulfilled, (state, action) => {
      console.log('Update prices successful');
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

export default uploadAlbum.reducer;
