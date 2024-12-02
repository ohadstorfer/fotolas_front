import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createPerAlbum, fetchPersonalAlbums, fetchWavesByList, getPricesBySess, getPricesForVideosBySess } from '../services/perAlbumAPI';

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
  cartTotalImages: number; // Total number of images in the cart
  cartTotalPrice: number;
  wavesInCart: personalAlbum[]; // Array to store fetched waves
  prices: any;
  next: string | null;
  previous: string | null;
  total_pages: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  serverError: string | null;
}

const initialCart = sessionStorage.getItem('cart');
const initialCartTotalImages = sessionStorage.getItem('cartTotalImages');
const initialCartTotalPrice = sessionStorage.getItem('cartTotalPrice');
const initialPrices = sessionStorage.getItem('prices');

const initialState: perAlbumState = {
  albums: [],
  newPerAlbum: null,
  cart: initialCart ? JSON.parse(initialCart) : [],
  cartTotalImages: initialCartTotalImages ? JSON.parse(initialCartTotalImages) : 0,
  cartTotalPrice: initialCartTotalPrice ? JSON.parse(initialCartTotalPrice) : 0,
  wavesInCart: [],
  prices : initialPrices ? JSON.parse(initialPrices) : 0,
  next: null,
  previous: null,
  total_pages: null,
  status: 'idle',
  serverError: null,
};

export const getDataAsync = createAsyncThunk<
  { albums: personalAlbum[]; next: string | null; previous: string | null ; total_pages: number | null},
  { albumId: number; page: number; pageSize: number }
>(
  'perAlbum/fetchPersonalAlbums',
  async ({ albumId, page, pageSize }) => {
    const response = await fetchPersonalAlbums(albumId, page, pageSize);
    console.log(response);
    
    return {
      albums: response.data.results,
      next: response.data.next,
      previous: response.data.previous,
      total_pages: response.data.total_pages,
    };
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

export const fetchWavesByListAsync = createAsyncThunk(
  'perAlbum/fetchWavesByList',
  async (waveIds: number[]) => {
    const response = await fetchWavesByList(waveIds);
    return response.data.waves;
  }
);


// Async thunk to fetch prices by session album ID
export const fetchPricesBySessionAlbumId = createAsyncThunk(
  'perAlbum/fetchPricesBySessionAlbumId',
  async (albumId: number) => {
    const response = await getPricesBySess(albumId);
    return response.data;
  }
);


// Async thunk to fetch prices by session album ID
export const fetchPricesForVideosBySessionAlbumId = createAsyncThunk(
  'perAlbum/fetchPricesForVideosBySessionAlbumId',
  async (albumId: number) => {
    const response = await getPricesForVideosBySess(albumId);
    return response.data;
  }
);


export const perAlbumSlice = createSlice({
  name: 'perAlbum',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ albumId: number, imageCount: number }>) => {
      if (!state.cart.includes(action.payload.albumId)) {
        state.cart.push(action.payload.albumId);
        state.cartTotalImages += action.payload.imageCount;
        sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
        sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages)); // Save to session storage
      }
    },
    removeFromCart: (state, action: PayloadAction<{ albumId: number, imageCount: number }>) => {
      state.cart = state.cart.filter((id) => id !== action.payload.albumId);
      state.cartTotalImages -= action.payload.imageCount;
      sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
      sessionStorage.setItem('cartTotalImages', JSON.stringify(state.cartTotalImages)); // Save to session storage
    },
    removeWaveFromCart: (state, action: PayloadAction<number>) => {
      state.wavesInCart = state.wavesInCart.filter((wave) => wave.id !== action.payload);
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.cartTotalPrice = action.payload;
      sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
    },
    setPrices: (state, action: PayloadAction<any>) => {
      state.prices = action.payload;
      sessionStorage.setItem('prices', JSON.stringify(state.prices)); // Save prices to session storage
    },
    clearPerAlbums: (state) => {
      state.albums = [];
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getDataAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getDataAsync.fulfilled, (state, action) => {
      console.log(action.payload);

      state.albums = action.payload.albums;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.total_pages = action.payload.total_pages;
      state.status = 'succeeded';
    })
    .addCase(getDataAsync.rejected, (state) => {
      state.status = 'failed';
      state.serverError = 'An error occurred';
    })
      .addCase(createPerAlbumAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPerAlbumAsync.fulfilled, (state, action) => {
        state.newPerAlbum = action.payload.id;
        console.log(state.newPerAlbum);
        state.status = 'succeeded';
      })
      .addCase(fetchWavesByListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWavesByListAsync.fulfilled, (state, action) => {
        state.wavesInCart = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchWavesByListAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchPricesBySessionAlbumId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPricesBySessionAlbumId.fulfilled, (state, action) => {
        state.prices = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchPricesBySessionAlbumId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchPricesForVideosBySessionAlbumId.pending, (state) => {
        state.status = 'loading';
      });
  },
});

export const { addToCart, removeFromCart, removeWaveFromCart, updateTotalPrice, setPrices , clearPerAlbums } = perAlbumSlice.actions;

export const selectPersonalAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.albums;
export const selectNewPerAlbum = (state: { perAlbum: perAlbumState }) => state.perAlbum.newPerAlbum;
export const selectCart = (state: { perAlbum: perAlbumState }) => state.perAlbum.cart;
export const selectWavesInCart_WAVES = (state: { perAlbum: perAlbumState }) => state.perAlbum.wavesInCart;
export const selectCartTotalImages_WAVES = (state: { perAlbum: perAlbumState }) => state.perAlbum.cartTotalImages;
export const selectCartTotalPrice_WAVES = (state: { perAlbum: perAlbumState }) => state.perAlbum.cartTotalPrice;
export const selectPrices_WAVES = (state: { perAlbum: perAlbumState }) => state.perAlbum.prices;
export const selectNextPageWaves = (state: { perAlbum: perAlbumState }) => state.perAlbum.next;
export const selectPreviousPageWaves = (state: { perAlbum: perAlbumState }) => state.perAlbum.previous;
export const selectServerError = (state: { perAlbum: perAlbumState }) => state.perAlbum.serverError;
export const select_total_pages = (state: { perAlbum: perAlbumState }) => state.perAlbum.total_pages;


export default perAlbumSlice.reducer;
