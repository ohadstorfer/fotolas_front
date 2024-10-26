// spotSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSpot, fetchAllSpots, fetchSpot } from '../services/spotAPI';

interface Spot {
  id: number;
  name: string;
  location: string;
  city: string;
  country: string;
  session_album_count: number;
}



interface SpotsState {
  spot: Spot | null;
  newSpot:Spot | null;
  allSpots:Spot[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SpotsState = {
  spot: null,
  newSpot:null,
  allSpots: [],
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


export const createSpotAsync = createAsyncThunk('createSpot', async (credentials: { name: string, city: string, country: string  }) => {
  console.log("Creating spot asynchronously");
  const response = await createSpot(credentials);
  return response.data; // Adjust based on the actual response structure
});




// Async thunk for fetching all spots
export const getAllSpots = createAsyncThunk<Spot[], void>(
  'spots/getAllSpots', // Update the action name
  async () => {
    const response = await fetchAllSpots(); // Update the service function name
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
      })
      
      .addCase(createSpotAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createSpotAsync.fulfilled, (state, action) => {
        state.newSpot = action.payload;
        state.error = null;
      })
      .addCase(createSpotAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })


      .addCase(getAllSpots.pending, (state) => {
        state.error = null;
      })
      .addCase(getAllSpots.fulfilled, (state, action) => {
        state.allSpots = action.payload;
        state.error = null;
      })
      .addCase(getAllSpots.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      });


  },
});

// Export actions and reducer
export const selectSpot = (state: { spot: SpotsState }) => state.spot.spot;
export const selectNewSpot = (state: { spot: SpotsState }) => state.spot.newSpot;
export const selectAllSpots = (state: { spot: SpotsState }) => state.spot.allSpots;
export default spotSlice.reducer;
