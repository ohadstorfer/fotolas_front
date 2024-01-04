import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../services/sighnInAPI';

export const loginAsync = createAsyncThunk('signIn/login', async (credentials: { email: string, password: string }) => {
  const response = await login(credentials);
  return response.data;
});

interface SignInState {
  token: string | null;
  error: string | null;
}

const initialState: SignInState = {
  token: null,
  error: null,
};

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.token = null;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const selectToken = (state: { signIn: SignInState }) => state.signIn.token;
export default signInSlice.reducer;
