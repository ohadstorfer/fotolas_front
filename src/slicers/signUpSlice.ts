import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signUp } from '../services/signUpAPI';


interface SignUpState {
  token: string | null;
  error: string | null;
  existedUseError: string | null;
  credentials: any | null;
  refresh: boolean,
}

const initialState: SignUpState = {
  token: null,
  error: null,
  existedUseError: null,
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
    refreshNavbarActtion: (state) => {
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
        if (action.error.message === 'A user with this email already exists.') {
          state.existedUseError = 'This email is already registered. Please use a different email address.';
        } else {
          state.existedUseError = action.error.message || 'An error occurred';
        }
      });
  },
});



export const {refreshNavbarActtion ,setCredentials, removeCredentials} = signUpSlice.actions;

export const selectSignUP = (state: { signUp: SignUpState }) => state.signUp.token;
export const selectCredentials = (state: { signUp: SignUpState }) => state.signUp.credentials;
export const selectRefreshNavbar = (state: { signUp: SignUpState }) => state.signUp.refresh;
export const selectExistedUseError = (state: { signUp: SignUpState }) => state.signUp.existedUseError;
export default signUpSlice.reducer;
