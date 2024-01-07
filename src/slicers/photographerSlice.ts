// photographerSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPhotographer } from '../services/photographerAPI';

interface Photographer {
  status: string;
  id: number;
  about: string;
  profile_image: string;
  cover_image: string;
  user: number;
  photographer_name: string;
  followers_count: number;
}

interface PhotographersState {
  photographer: Photographer | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PhotographersState = {
  photographer: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching a photographer by ID
export const getPhotographerById = createAsyncThunk<Photographer, number>(
  'photographers/getPhotographerById',
  async (photographerId) => {
    console.log(photographerId);
    const response = await fetchPhotographer(photographerId);
    console.log(response.data);
    
    return response.data;
  }
);


// Create a photographer slice
const photographerSlice = createSlice({
  name: 'photographers',
  initialState,
  reducers: {
    clearPhotographer: (state) => {
      state.photographer = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotographerById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPhotographerById.fulfilled, (state, action) => {
        state.photographer = action.payload;
        console.log(state.photographer);
        
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getPhotographerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch photographer';
      });
  },
});

// Export actions and reducer
export const { clearPhotographer } = photographerSlice.actions;
export const selectPhotographer = (state: { photographers?: PhotographersState }) =>  state.photographers?.photographer ?? null;
export default photographerSlice.reducer;
