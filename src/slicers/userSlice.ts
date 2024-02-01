// userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUser } from '../services/userAPI';

interface User {
  status: string;
  id: number;
  email: string;
  fullName: string;
  is_athlete: boolean;
  is_photographer: boolean;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: Date;
  last_login: Date;
  chats: number; 
  // keep in mind that chats is many to many
}

interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching a user by ID
export const getUserById = createAsyncThunk<User, number>(
  'users/getUserById',
  async (userId) => {
    console.log("getUserById");
    
    const response = await fetchUser(userId);
    return response.data;
  }
);

// Create a user slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUser: (state) => {
      console.log("clearing user");
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

// Export actions and reducer
export const { clearUser } = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) =>  state.user.user;
export default userSlice.reducer;
