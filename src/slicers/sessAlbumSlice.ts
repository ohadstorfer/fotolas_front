// sessAlbumSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatDistanceToNow } from 'date-fns';  // Import from date-fns
import { allSessAlbum, createSessAlbum, sessAlbumsByPhotographer, sessAlbumsBySpot, updatePrices } from '../services/sessAlbumAPI';

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
  photographer_profile_image: string
}

interface sessAlbumState {
  sess: sess[];
  newSess:number | null;
  prices: {}| null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: sessAlbumState = {
  sess: [],
  newSess:null,
  prices:null,
  status: 'idle',
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
        } else {
          console.log("filter id is undefined");
          
        }
        break;
      case 'spot':
        if (filterId !== undefined) {
          response = await sessAlbumsBySpot(filterId);
        } else {
          // Handle the case where filterId is undefined (you can throw an error or return some default data)
        }
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




export const createSessAlbumAsync = createAsyncThunk('createSessAlbum', async (credentials: { sessDate: Date, spot: number, photographer: number, cover_image:string  }) => {
  console.log("Creating spot asynchronously");
  const response = await createSessAlbum(credentials);
  return response.data; 
});



export const updatePricesAsync = createAsyncThunk('updatePrices', async (credentials: {session_album: number, singlePhotoPrice: number, price_1_to_5: number, price_6_to_10: number, price_11_to_20: number, price_21_to_50:number, price_51_plus:number  }) => {
  console.log("updatePrices asynchronously");
  const response = await updatePrices(credentials);
  return response.data; 
});




export const sessAlbumSlice = createSlice({
  name: 'sessAlbum',
  initialState,
  reducers: {},
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
      
  },
});


export const selectSessAlbums = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.sess;
export const selectNewSess = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.newSess;
export const selectPrices = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.prices;

export default sessAlbumSlice.reducer;
