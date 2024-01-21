// photographerSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPhotographer } from '../services/photographerAPI';
import { PhotographerByUserId } from '../services/profilePtgAPI';

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
  profilePhotographer: Photographer | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PhotographersState = {
  profilePhotographer: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching a photographer by ID
export const getPhotographerByUserId = createAsyncThunk<Photographer, number>(
  'photographers/getPhotographerByUserId',
  async (userId) => {
    const response = await PhotographerByUserId(userId);
    return response.data;
  }
);

// Create a photographer slice
const profilePtgSlice = createSlice({
  name: 'profilePtg',
  initialState,
  reducers: {
    clearPhotographer: (state) => {
      state.profilePhotographer = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotographerByUserId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPhotographerByUserId.fulfilled, (state, action) => {
        state.profilePhotographer = action.payload;
        console.log(state.profilePhotographer);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getPhotographerByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch photographer';
      });
  },
});

// Export actions and reducer
export const { clearPhotographer } = profilePtgSlice.actions;

// Selectors
export const selectProfilePhotographer = (state: { profilePhotographer: PhotographersState }) =>  state.profilePhotographer.profilePhotographer;
export default profilePtgSlice.reducer;
