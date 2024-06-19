import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { becomePhotographer } from '../services/becomePhotographerAPI';


interface becPhotogState {
  newPhotographer: boolean
  error: string | null;
}

const initialState: becPhotogState = {
  newPhotographer: false,
  error: null,
};


export const becomePhotographerAsync = createAsyncThunk('becPhotog', async (credentials: { user: number, about: string, profile_image: string  }) => {
  console.log("doing becomePhotographerAsync");
  
  const response = await becomePhotographer(credentials);
  return response.data;
});

const becomePhotographerSlice = createSlice({
  name: 'becomePhotographer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(becomePhotographerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(becomePhotographerAsync.fulfilled, (state, action) => {
        state.newPhotographer = true
        state.error = null;
      })
      .addCase(becomePhotographerAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const selectBecomePhotographer = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.newPhotographer;
export default becomePhotographerSlice.reducer;
