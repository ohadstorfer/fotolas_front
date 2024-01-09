// sessAlbumSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatDistanceToNow } from 'date-fns';  // Import from date-fns
import { allSessAlbum, sessAlbumsByPhotographer, sessAlbumsBySpot } from '../services/sessAlbumAPI';

interface sess {
  id: number;
  created_at: Date;
  updated_at: Date;
  cover_image: string;
  spot: number;
  photographer: number;
  albums_prices: any;
  sessDate: Date;
  spot_name: string;
  photographer_name: string;
  photographer_profile_image: string
}

interface sessAlbumState {
  sess: sess[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: sessAlbumState = {
  sess: [],
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
      });
  },
});


export const selectSessAlbums = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.sess;

export default sessAlbumSlice.reducer;
