import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, passwordReset, passwordResetRequest, validateToken } from '../services/sighnInAPI';
import { refreshTokenAPI } from '../services/profilePtgAPI';

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
  error: string | null | undefined;
  spanish:  boolean;
  isExpired: boolean;
  emailSent: boolean;
  passwordChanged: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string,
}


const initialToken = localStorage.getItem('token');
const initialSpanish = sessionStorage.getItem('spanish');
const initialLoggedIn = !!initialToken;

const initialState: SignInState = {
  token: initialToken ? JSON.parse(initialToken) : null,
  loggedIn: initialLoggedIn? initialLoggedIn : false,
  error: null ,
  spanish: initialSpanish ? JSON.parse(initialSpanish) : false,
  isExpired: false,
  emailSent: false,
  passwordChanged: false,
  status: 'idle',  // idle | loading | succeeded | failed
  message: '',
};

export const loginAsync = createAsyncThunk('signIn/login', async (credentials: { email: string, password: string }) => {
  const response = await login(credentials);
  return response.data;
});


// Define the thunk to handle refreshing tokens
export const refreshTokenAsync = createAsyncThunk<Token, string>(
  'signIn/refreshToken',
  async (refreshToken: string) => {
    const response = await refreshTokenAPI(refreshToken);  // Use the renamed function
    return response;
  }
);




// New thunk for validating tokens
export const validateTokenAsync = createAsyncThunk<boolean, string>(
  'signIn/validateToken',
  async (token: string) => {
      const response = await validateToken(token);
      return response;
  }
);



// Thunk to handle password reset request
export const passwordResetRequestAsync = createAsyncThunk(
  'passwordReset/request',
  async (email: { email: string }) => {
    const response = await passwordResetRequest(email);
    return response.data;
  }
);





// Thunk to handle password reset request
export const passwordResetAsync = createAsyncThunk(
  'passwordReset/reset',
  async (data: { token: string; password: string }, thunkAPI) => {
      const response = await passwordReset(data);
      return response.data;
  }
);





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
    toggleSpanish(state) {
      state.spanish = !state.spanish; // Toggle the value of 'spanish'
      sessionStorage.setItem('spanish', JSON.stringify(state.spanish)); // Store the value in sessionStorage
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
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        localStorage.setItem('token', JSON.stringify(action.payload));
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message || 'Failed to refresh token';
      })
      .addCase(validateTokenAsync.fulfilled, (state, action) => {
        console.log("state.isExpired = false");
      })
      .addCase(validateTokenAsync.rejected, (state, action) => {
        console.log("state.isExpired = true");
        
        state.isExpired = true;
      })
      .addCase(passwordResetRequestAsync.pending, (state) => {

        state.error = null;
      })
      .addCase(passwordResetRequestAsync.fulfilled, (state, action) => {
        state.emailSent = true;
        state.error = null;
      })
      .addCase(passwordResetRequestAsync.rejected, (state, action) => {
        state.error = action.error.message;
        console.log(state.error);
        
      })
      .addCase(passwordResetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(passwordResetAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
        state.passwordChanged = true;
      })
      .addCase(passwordResetAsync.rejected, (state, action) => {
        state.status = 'failed';
        // state.error = action.payload;
      })
      ;
  },
});

export const { logout, parseJwt,toggleSpanish  } = signInSlice.actions;
export const selectToken = (state: { signIn: SignInState }) => state.signIn.token;
export const selectLoggedIn = (state: { signIn: SignInState }) => state.signIn.loggedIn;
export const selectSpanish = (state: { signIn: SignInState }) => state.signIn.spanish;
export const selectIsExpired = (state: { signIn: SignInState }) => state.signIn.isExpired;
export const selectEmailSent = (state: { signIn: SignInState }) => state.signIn.emailSent;
export const selectError = (state: { signIn: SignInState }) => state.signIn.error;
export const selectPasswordChanged = (state: { signIn: SignInState }) => state.signIn.passwordChanged;
export default signInSlice.reducer;
