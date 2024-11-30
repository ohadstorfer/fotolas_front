import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchWavesByList, getPricesBySess, getPricesForVideosBySess } from '../services/perAlbumAPI';

interface personalAlbum {
    sessAlbum: any;
    id: number;
    cover_image: string;
    session_album: number;
    image_count: number;
}

interface Img {
    id: number;
    photo: string;
    WatermarkedPhoto: string;
    price: number;
    personal_album: number;
    SessionAlbum: number;
}

interface Video {
    id: number;
    video: string;
    WatermarkedVideo: string;
    SessionAlbum: number;
}

interface sess {
    id: number;
    created_at: Date;
    updated_at: Date;
    cover_image: string;
    spot: number;
    photographer: number;
    albums_prices: number;
    sessDate: Date;
    spot_name: string;
    photographer_name: string;
    photographer_profile_image: string;
    photographer_stripe_account_id: string;
    videos: boolean;
    videosPerAlbums: boolean;
    dividedToWaves: boolean;
    expiration_date: Date;
    days_until_expiration: number;
  }

interface cartState {
    cart: number[]; // Array of album IDs in the cart
    cartOfSingleImages: Img[];
    cartOfVideos: Video[];
    cartOfWaves: personalAlbum[];
    cartTotalItems: number;
    totalImagesInWaves: number; // Total number of images in the cart
    cartTotalPrice: number;
    wavesInCart: personalAlbum[]; // Array to store fetched waves
    prices: any | null;
    sessAlbumOfCart: sess | null;
    cartType: 'singleImages' | 'waves' | 'videos' | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    copyCartType: 'singleImages' | 'waves' | 'videos' | null;
    copyCart: number[];
}

const initialCart = sessionStorage.getItem('cart');
const initialCartOfSingleImages = sessionStorage.getItem('cartOfSingleImages');
const initialCartOfVideos = sessionStorage.getItem('cartOfVideos');
const initialCartOfWaves = sessionStorage.getItem('cartOfWaves');
const initialcartTotalItems = sessionStorage.getItem('cartTotalItems');
const initialCartTotalPrice = sessionStorage.getItem('cartTotalPrice');
const initialSessAlbumOfCart = sessionStorage.getItem('sessAlbumOfCart');
const initialPrices = sessionStorage.getItem('prices');
const initialCartType = sessionStorage.getItem('cartType');
const initialTotalImagesInWaves = sessionStorage.getItem('totalImagesInWaves');
const initialCopyCartType = sessionStorage.getItem('copyCartType');
const initialCopyCart = sessionStorage.getItem('copyCart');


const initialState: cartState = {
    cart: initialCart ? JSON.parse(initialCart) : [],
    cartOfSingleImages: initialCartOfSingleImages ? JSON.parse(initialCartOfSingleImages) : [],
    cartOfVideos: initialCartOfVideos ? JSON.parse(initialCartOfVideos) : [],
    cartOfWaves: initialCartOfWaves ? JSON.parse(initialCartOfWaves) : [],
    cartTotalItems: initialcartTotalItems ? JSON.parse(initialcartTotalItems) : 0,
    totalImagesInWaves: initialTotalImagesInWaves ? JSON.parse(initialTotalImagesInWaves) : 0,
    cartTotalPrice: initialCartTotalPrice ? JSON.parse(initialCartTotalPrice) : 0,
    wavesInCart: [],
    prices: initialPrices ? JSON.parse(initialPrices) : null,
    sessAlbumOfCart: initialSessAlbumOfCart ? JSON.parse(initialSessAlbumOfCart) : null,
    cartType: initialCartType ? JSON.parse(initialCartType) : null,
    status: 'idle',
    copyCart: initialCopyCart ? JSON.parse(initialCopyCart) : null,
    copyCartType: initialCopyCartType ? JSON.parse(initialCopyCartType) : null,
};

export const fetchWavesByListAsync = createAsyncThunk(
    'cart/fetchWavesByList',
    async (waveIds: number[]) => {
        const response = await fetchWavesByList(waveIds);
        return response.data.waves;
    }
);

export const fetchPricesBySessionAlbumId = createAsyncThunk(
    'cart/fetchPricesBySessionAlbumId',
    async (albumId: number) => {
        const response = await getPricesBySess(albumId);
        return response.data;
    }
);

export const fetchPricesForVideosBySessionAlbumId = createAsyncThunk(
    'cart/fetchPricesForVideosBySessionAlbumId',
    async (albumId: number) => {
        const response = await getPricesForVideosBySess(albumId);
        console.log(response.data);
        
        return response.data;
    }
);


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCopyCart: (state) => {
            state.copyCartType = state.cartType;
            sessionStorage.setItem('copyCartType', JSON.stringify(state.cartType));
            state.copyCart = state.cart;
            sessionStorage.setItem('copyCart', JSON.stringify(state.cart));
        },
        addToCart_singleImages: (state, action: PayloadAction<Img>) => {
            const image = action.payload;
            if (!state.cart.includes(image.id)) {
                state.cart.push(image.id);
                state.cartOfSingleImages.push(image);
                state.cartTotalItems = state.cart.length;
                state.cartType = 'singleImages';
                sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
                sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems)); // Save to session storage
                sessionStorage.setItem('cartOfSingleImages', JSON.stringify(state.cartOfSingleImages));
                sessionStorage.setItem('cartType', JSON.stringify(state.cartType)); // Save to session storage
            }
        },
        addToCart_videos: (state, action: PayloadAction<Video>) => {
            const video = action.payload;
            if (!state.cart.includes(video.id)) {
                state.cart.push(video.id);
                state.cartOfVideos.push(video);
                state.cartTotalItems = state.cart.length;
                state.cartType = 'videos';
                sessionStorage.setItem('cart', JSON.stringify(state.cart));
                sessionStorage.setItem('cartOfVideos', JSON.stringify(state.cartOfVideos)); // Save to session storage
                sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems)); // Save to session storage
                sessionStorage.setItem('cartType', JSON.stringify(state.cartType)); // Save to session storage
            }
        },
        addToCart_waves: (state, action: PayloadAction<{ waveId: number, imageCount: number }>) => {
            if (!state.cart.includes(action.payload.waveId)) {
                state.cart.push(action.payload.waveId);
                state.cartTotalItems += action.payload.imageCount;
                state.cartType = 'waves';
                sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
                sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems)); // Save to session storage
                sessionStorage.setItem('cartType', JSON.stringify(state.cartType)); // Save to session storage
            }
        }, 
        clearCart: (state) => {
              state.cart = [];
              state.cartOfSingleImages = [];
              state.cartOfVideos = [];
              state.cartOfWaves = [];
              state.cartType = null;
              state.sessAlbumOfCart = null;
              state.cartTotalItems = 0;
              sessionStorage.removeItem('cartType');
              sessionStorage.removeItem('sessAlbumOfCart');
              sessionStorage.removeItem('cartTotalPrice');
              sessionStorage.removeItem('cart');
              sessionStorage.removeItem('cartTotalItems');
          },
        removeFromCart_singleImages: (state, action: PayloadAction<{ imgId: number }>) => {
            state.cart = state.cart.filter((id) => id !== action.payload.imgId);
            state.cartOfSingleImages = state.cartOfSingleImages.filter((img) => img.id !== action.payload.imgId);
            state.cartTotalItems = state.cart.length;
            sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
            sessionStorage.setItem('cartOfSingleImages', JSON.stringify(state.cartOfSingleImages));
            sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems)); // Save to session storage
            if (state.cartOfSingleImages.length === 0) {
                state.cartType = null;
                sessionStorage.removeItem('cartType');
                state.sessAlbumOfCart = null;
                sessionStorage.removeItem('sessAlbumOfCart');
                sessionStorage.removeItem('cartOfSingleImages');

            }
        },
        removeFromCart_videos: (state, action: PayloadAction<{ videoId: number }>) => {
            state.cart = state.cart.filter((id) => id !== action.payload.videoId);
            state.cartOfVideos = state.cartOfVideos.filter((video) => video.id !== action.payload.videoId);
            state.cartTotalItems = state.cart.length;
            sessionStorage.setItem('cart', JSON.stringify(state.cart));
            sessionStorage.setItem('cartOfVideos', JSON.stringify(state.cartOfVideos));
            sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems));
            if (state.cartOfVideos.length === 0) {
              state.cartType = null;
              sessionStorage.removeItem('cartType');
              state.sessAlbumOfCart = null;
              sessionStorage.removeItem('sessAlbumOfCart');
              sessionStorage.removeItem('cartOfVideos');
            }
          },
        removeFromCart_waves: (state, action: PayloadAction<{ waveId: number, imageCount: number }>) => {
            state.cart = state.cart.filter((id) => id !== action.payload.waveId);
            state.cartOfWaves = state.cartOfWaves.filter((wave) => wave.id !== action.payload.waveId);
            state.cartTotalItems -= action.payload.imageCount;
            sessionStorage.setItem('cart', JSON.stringify(state.cart)); // Save to session storage
            sessionStorage.setItem('cartTotalItems', JSON.stringify(state.cartTotalItems)); // Save to session storage
        },
        setSessAlbumOfCart: (state, action: PayloadAction<sess>) => {
            state.sessAlbumOfCart = action.payload;
            sessionStorage.setItem('sessAlbumOfCart', JSON.stringify(state.sessAlbumOfCart));
        },
        removeSessAlbumOfCart: (state) => {
            state.sessAlbumOfCart = null;
            sessionStorage.removeItem('sessAlbumOfCart');
        },
        setCartType: (state, action: PayloadAction<'singleImages' | 'waves' | 'videos'>) => {
            state.cartType = action.payload;
            sessionStorage.setItem('cartType', JSON.stringify(state.cartType));
        },
        removeCartType: (state) => {
            state.cartType = null;
            sessionStorage.removeItem('cartType');
        },
        updateTotalPrice: (state, action: PayloadAction<number>) => {
            state.cartTotalPrice = action.payload;
            sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
        },
        calculatePriceForImages: (state) => {
            if (!state.prices) return;
            let totalPrice = 0;
            if (state.cartTotalItems == 0 ) {
                totalPrice = 0;
            } else if (state.cartTotalItems >= 1 && state.cartTotalItems <= 5) {
                totalPrice = parseFloat(state.prices.price_1_to_5);
            } else if (state.cartTotalItems >= 6 && state.cartTotalItems <= 50) {
                totalPrice = parseFloat(state.prices.price_6_to_50);
            } else {
                totalPrice = parseFloat(state.prices.price_51_plus);
            }
            state.cartTotalPrice = totalPrice;
            sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
        },
        calculatePriceForWaves: (state) => {
            if (!state.prices) return;
            let totalPrice = 0;
            if (state.totalImagesInWaves == 0 ) {
                totalPrice = 0;
            } else if (state.totalImagesInWaves >= 1 && state.totalImagesInWaves <= 5) {
                totalPrice = parseFloat(state.prices.price_1_to_5);
            } else if (state.totalImagesInWaves >= 6 && state.totalImagesInWaves <= 50) {
                totalPrice = parseFloat(state.prices.price_6_to_50);
            } else {
                totalPrice = parseFloat(state.prices.price_51_plus);
            }
            state.cartTotalPrice = totalPrice;
            console.log("state.cartTotalPrice: " , state.cartTotalPrice);
            
            sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
        },
        calculatePriceForVideos: (state) => {
            if (!state.prices) return;
            let totalPrice = 0;
            if (state.cartTotalItems == 0 ) {
                totalPrice = 0;
            }else if (state.cartTotalItems >= 1 && state.cartTotalItems <= 3) {
                totalPrice = parseFloat(state.prices.price_1_to_3);
            } else if (state.cartTotalItems >= 4 && state.cartTotalItems <= 15) {
                totalPrice = parseFloat(state.prices.price_4_to_15);
            } else {
                totalPrice = parseFloat(state.prices.price_16_plus);
            }
            state.cartTotalPrice = totalPrice;
            sessionStorage.setItem('cartTotalPrice', JSON.stringify(state.cartTotalPrice));
        },
    },
    extraReducers: (builder) => {
        builder
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
            console.log("state.prices: " , state.prices);
            
            state.status = 'succeeded';
          })
          .addCase(fetchPricesBySessionAlbumId.rejected, (state) => {
            state.status = 'failed';
          })
          .addCase(fetchPricesForVideosBySessionAlbumId.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchPricesForVideosBySessionAlbumId.fulfilled, (state, action) => {
            console.log(action.payload);
            state.prices = action.payload;
            console.log(state.prices);
            state.status = 'succeeded';
          })
          .addCase(fetchPricesForVideosBySessionAlbumId.rejected, (state) => {
            state.status = 'failed';
          });
      }
});

export const { setCopyCart,clearCart,calculatePriceForWaves, addToCart_waves, removeCartType, setCartType, removeFromCart_waves, addToCart_videos, removeFromCart_videos, addToCart_singleImages, removeFromCart_singleImages, updateTotalPrice, calculatePriceForImages, calculatePriceForVideos, setSessAlbumOfCart, removeSessAlbumOfCart } = cartSlice.actions;

export const selectCart = (state: { cart: cartState }) => state.cart.cart;
export const selectWavesInCart = (state: { cart: cartState }) => state.cart.wavesInCart;
export const selectCartTotalItems = (state: { cart: cartState }) => state.cart.cartTotalItems;
export const selectTotalImagesInWaves = (state: { cart: cartState }) => state.cart.totalImagesInWaves;
export const selectCartTotalPrice = (state: { cart: cartState }) => state.cart.cartTotalPrice;
export const selectPrices = (state: { cart: cartState }) => state.cart.prices;
export const selectSessAlbumOfCart = (state: { cart: cartState }) => state.cart.sessAlbumOfCart;
export const selectCartOfSingleImages = (state: { cart: cartState }) => state.cart.cartOfSingleImages;
export const selectCartOfVideos = (state: { cart: cartState }) => state.cart.cartOfVideos;
export const selectCartOfWaves = (state: { cart: cartState }) => state.cart.cartOfWaves;
export const selectCopyCart = (state: { cart: cartState }) => state.cart.copyCart;
export const selectCopyCartType = (state: { cart: cartState }) => state.cart.copyCartType;

export default cartSlice.reducer;
