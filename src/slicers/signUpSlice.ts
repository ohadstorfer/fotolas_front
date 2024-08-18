import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signUp } from '../services/signUpAPI';


interface SignUpState {
  token: string | null;
  error: string | null;
  credentials: any | null;
  refresh: boolean,
}

const initialState: SignUpState = {
  token: null,
  error: null,
  credentials: null,
  refresh: false,
};


export const signUpAsync = createAsyncThunk('signIn/login', async (credentials: { email: string, fullName: string, password: string }) => {
  console.log("signUPPPPP");
  
  const response = await signUp(credentials);
  return response.data;
});

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      state.credentials = action.payload;
    },
    removeCredentials: (state) => {
      state.credentials = null;
    },
    refreshNavbar: (state) => {
      state.refresh = !state.refresh;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.token = null;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'An error occurred';
      });
  },
});



export const {refreshNavbar ,setCredentials, removeCredentials} = signUpSlice.actions;

export const selectSignUP = (state: { signUp: SignUpState }) => state.signUp.token;
export const selectCredentials = (state: { signUp: SignUpState }) => state.signUp.credentials;
export const selectRefreshNavbar = (state: { signUp: SignUpState }) => state.signUp.refresh;
export default signUpSlice.reducer;
