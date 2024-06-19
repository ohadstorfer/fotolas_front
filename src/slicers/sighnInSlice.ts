// sighnInSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../services/sighnInAPI';


interface SignInState {
  token: string | null;
  loggedIn: boolean;
  error: string | null;
}


const initialState: SignInState = {
  token: "",
  loggedIn: false,
  error: null,
};




export const loginAsync = createAsyncThunk('signIn/login', async (credentials: { email: string, password: string }) => {

  const response = await login(credentials);
  return response.data;
});


const signInSlice = createSlice({
  name: 'signIn',
  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      state.loggedIn = false;
    },
    parseJwt: (state) => {
      const token = state.token;
      if (token && typeof token === 'string') {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const base64Url = tokenParts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const parsedPayload = JSON.parse(jsonPayload);

          console.log(parsedPayload.access);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.token = null;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.token = JSON.stringify(action.payload);
        state.loggedIn = true;
        localStorage.setItem("token", (state.token));
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { logout, parseJwt } = signInSlice.actions;
export const selectToken = (state: { signIn: SignInState }) => state.signIn.loggedIn;
export default signInSlice.reducer;


