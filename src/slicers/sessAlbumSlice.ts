// sessAlbumSlice.ts
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatDistanceToNow } from 'date-fns';  // Import from date-fns
import { allSessAlbum, createSessAlbum, sessAlbumsByPhotographer, sessAlbumsBySpot, updatePrices,updatePricesForVideos } from '../services/sessAlbumAPI';

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
  videos: boolean;
  dividedToWaves: boolean;
}

interface sessAlbumState {
  sess: sess[];
  selectedSessAlbum: sess | null;
  newSess:number | null;
  prices: {}| null;
  videos: boolean;
  dividedToWaves: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const selectedSessAlbum = sessionStorage.getItem('selectedSessAlbum');

const initialState: sessAlbumState = {
  sess: [],
  newSess:null,
  prices:null,
  videos: false,
  dividedToWaves: false,
  status: 'idle',
  selectedSessAlbum: selectedSessAlbum ? JSON.parse(selectedSessAlbum) : [],
  
};

export const calculateTimeAgo = (dateString: Date) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};



export const sessGetDataAsync = createAsyncThunk<sess[], { filterType?: string, filterId?: number }>(
  'sessAlbum/fetchImages',
  async ({ filterType, filterId }: { filterType?: string, filterId?: number } = {}) => {
    let response;

    switch (filterType) {
      case 'photographer':
        if (filterId !== undefined) {
          response = await sessAlbumsByPhotographer(filterId);
        } else {console.log("filter id is undefined");}
        break;
      case 'spot':
        if (filterId !== undefined) {
          response = await sessAlbumsBySpot(filterId);
        } else {}
        break;
      default:
        response = await allSessAlbum();
        break;
    }

    const responseData = response?.data || [];

    return responseData.map((item: { sessDate: Date }) => ({
      ...item,
      timeAgo: calculateTimeAgo(item.sessDate),
    }));
  }
);




export const createSessAlbumAsync = createAsyncThunk(
  'sessAlbum/createSessAlbum',
  async (credentials: { sessDate: Date, spot: number, photographer: number, cover_image: string, videos: boolean }) => {
    const response = await createSessAlbum(credentials);
    return response.data;
  }
);



export const updatePricesAsync = createAsyncThunk('updatePrices', async (credentials: {session_album: number, price_1_to_5: number, price_6_to_20: number, price_21_to_50:number, price_51_plus:number  }) => {
  console.log("updatePrices asynchronously");
  const response = await updatePrices(credentials);
  return response.data; 
});


export const updatePricesForVideosAsync = createAsyncThunk('updatePricesForVideos', async (credentials: {session_album: number, price_1_to_5: number, price_6_to_15: number, price_16_plus:number  }) => {
  console.log("updatePricesForVideos asynchronously");
  const response = await updatePricesForVideos(credentials);
  return response.data; 
});


export const sessAlbumSlice = createSlice({
  name: 'sessAlbum',
  initialState,
  reducers: {
    setSelectedSessAlbum: (state, action: PayloadAction<sess>) => {
      state.selectedSessAlbum = action.payload;
      sessionStorage.setItem('selectedSessAlbum', JSON.stringify(state.selectedSessAlbum));
    },
    removeSelectedSessAlbum: (state) => {
      state.selectedSessAlbum = null;
      sessionStorage.removeItem('selectedSessAlbum');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sessGetDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sessGetDataAsync.fulfilled, (state, action) => {
        state.sess = action.payload;
        state.status = 'succeeded';
      })



      .addCase(createSessAlbumAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createSessAlbumAsync.fulfilled, (state, action) => {
        state.newSess = action.payload.id;
        action.payload.videos == true ? state.videos = true : state.videos = false;
        console.log(state.newSess);
        
        state.status = 'succeeded';
      })
      .addCase(createSessAlbumAsync.rejected, (state, action) => {
        state.status = 'failed';
      })


      .addCase(updatePricesAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updatePricesAsync.fulfilled, (state, action) => {
        state.prices = action.payload;
        console.log("prices in the slicer: ", state.prices);
        
        state.status = 'succeeded';
      })
      .addCase(updatePricesAsync.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(updatePricesForVideosAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePricesForVideosAsync.fulfilled, (state, action) => {
        state.prices = action.payload;
        console.log("prices, from the slicer: " , state.prices);
        state.status = 'succeeded';
      })
      .addCase(updatePricesForVideosAsync.rejected, (state) => {
        state.status = 'failed';
      });
      
  },
});

export const {setSelectedSessAlbum, removeSelectedSessAlbum} = sessAlbumSlice.actions;

export const selectSessAlbums = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.sess;
export const selectNewSess = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.newSess;
export const selectPrices = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.prices;
export const selectVideos = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.videos;
export const selectDividedToWaves = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.dividedToWaves;
export const selectSelectedSessAlbum = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.selectedSessAlbum;

export default sessAlbumSlice.reducer;