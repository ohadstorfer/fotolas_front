import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signUp } from '../services/signUpAPI';


interface SignUpState {
  token: string | null;
  error: string | null;
}

const initialState: SignUpState = {
  token: null,
  error: null,
};


export const signUpAsync = createAsyncThunk('signIn/login', async (credentials: { email: string, fullName: string, password: string }) => {
  const response = await signUp(credentials);
  return response.data;
});

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.token = null;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        console.log(state.token);
        
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const selectSignUP = (state: { signUp: SignUpState }) => state.signUp.token;
export default signUpSlice.reducer;
