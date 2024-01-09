// spotSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSpot } from '../services/spotAPI';

interface Spot {
  id: number;
  name: string;
  location: string;
  city: string;
  country: string;
}

interface SpotsState {
  spot: Spot | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SpotsState = {
  spot: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching a spot by ID
export const getSpotById = createAsyncThunk<Spot, number>(
  'spots/getSpotById', // Update the action name
  async (spotId) => {
    const response = await fetchSpot(spotId); // Update the service function name
    return response.data;
  }
);

// Create a spot slice
const spotSlice = createSlice({
  name: 'Spots',
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpotById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSpotById.fulfilled, (state, action) => {
        state.spot = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getSpotById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch spot'; // Update the error message
      });
  },
});

// Export actions and reducer
export const selectSpot = (state: { spot: SpotsState }) => state.spot.spot;
export default spotSlice.reducer;
