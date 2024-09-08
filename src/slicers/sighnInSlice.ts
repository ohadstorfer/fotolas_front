import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../services/sighnInAPI';

interface Token {
  access: string;
  refresh: string;
  id: string;      // Adjust type if necessary
  fullName: string;
  email: string; 
  is_photographer: boolean;
}

interface SignInState {
  token: Token | null;
  loggedIn: boolean;
  error: string | null;
}


const initialToken = localStorage.getItem('token');
const initialLoggedIn = !!initialToken;

const initialState: SignInState = {
  token: initialToken ? JSON.parse(initialToken) : null,
  loggedIn: initialLoggedIn? initialLoggedIn : false,
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
    // Optional: If you need to parse the JWT manually, you might adjust this
    parseJwt: (state) => {
      const token = state.token;
      if (token) {
        console.log(token.access);  // Access properties directly
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
        console.log("logging in");
        state.token = action.payload;  // Assuming action.payload is of type Token
        state.loggedIn = true;
        localStorage.setItem("token", JSON.stringify(action.payload)); // Store as string
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { logout, parseJwt } = signInSlice.actions;
export const selectToken = (state: { signIn: SignInState }) => state.signIn.token;
export const selectLoggedIn = (state: { signIn: SignInState }) => state.signIn.loggedIn;
export default signInSlice.reducer;
