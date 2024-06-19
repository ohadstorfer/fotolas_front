// perAlbumSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createPerAlbum, fetchPersonalAlbums } from '../services/perAlbumAPI';

interface personalAlbum {
  sessAlbum: any;
  id: number;
  cover_image: string;
  session_album: number;
  image_count: number;
}

interface perAlbumState {
  albums: personalAlbum[];
  newPerAlbum: personalAlbum | null;
  cart: number[]; // Array of album IDs in the cart
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialCart = sessionStorage.getItem('cart');

const initialState: perAlbumState = {
  albums: [],
  newPerAlbum: null,
  cart: initialCart ? JSON.parse(initialCart) : [],
  status: 'idle',
};

export const getDataAsync = createAsyncThunk<personalAlbum[], number>(
  'perAlbum/fetchPersonalAlbums',
  async (albumId: number) => {
    const response = await fetchPersonalAlbums(albumId);
    return Array.isArray(response.data) ? response.data : [response.data];
  }
);

export const createPerAlbumAsync = createAsyncThunk(
  'createPerAlbum',
  async (credentials: { session_album: number; cover_image: string }) => {
    console.log('createPerAlbum asynchronously');
    const response = await createPerAlbum(credentials);
    return response.data;
  }
);

export const perAlbumSlice = createSlice({
  name: 'perAlbum',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      if (!state.cart.includes(action.payload)) {
        state.cart.push(action.payload);
        sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((id) => id !== action.payload);
      sessionStorage.setItem ( 'cart', JSON.stringify(state.cart));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.albums = action.payload.map((album) => ({
          ...album,
          image_count: album.image_count,
        }));
        state.status = 'succeeded';
      })
      .addCase(createPerAlbumAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPerAlbumAsync.fulfilled, (state, action) => {
        state.newPerAlbum = action.payload.id;
        console.log(state.newPerAlbum);
        state.status = 'succeeded';
      });
  },
});

export const { addToCart , removeFromCart} = perAlbumSlice.actions;

export const selectPersonalAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.albums;

export const selectNewPerAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.newPerAlbum;

export const selectCart = (state: { perAlbum: perAlbumState }) => state.perAlbum.cart;

export default perAlbumSlice.reducer;
