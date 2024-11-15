// sessAlbumSlice.ts
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { allSessAlbum, createSessAlbum, deactivateSessionAlbum, sessAlbumsByPhotographer, sessAlbumsBySpot, sessById, updatePrices,updatePricesForVideos } from '../services/sessAlbumAPI';
import { getPricesBySess } from '../services/perAlbumAPI';

interface sess {
  id: number;
  created_at: Date;
  updated_at: Date;
  cover_image: string;
  spot: number;
  photographer: number;
  photographer_stripe_account_id: string;
  albums_prices: number;
  sessDate: Date;
  spot_name: string;
  photographer_name: string;
  photographer_profile_image: string;
  videos: boolean;
  dividedToWaves: boolean;
  active: boolean;
  expiration_date: Date;
  days_until_expiration: number;
}

interface sessAlbumState {
  sess: sess[];
  selectedSessAlbum: sess | null;
  newSess:sess | null;
  newSessDetails:sess | null;
  newPrices: {}| null;
  pricesSelectedSessAlbum: any | null;
  videos: boolean;
  dividedToWaves: boolean;
  next: string | null;
  previous: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}


interface FetchParams {
  filterType?: string;
  filterId?: number;
  page?: number;      // Pagination parameter for page number
  pageSize?: number; // Pagination parameter for page size
}

const initialNewSess = sessionStorage.getItem('newSess');
const initialNewPrices = sessionStorage.getItem('newPrices');
const initialSelectedSessAlbum = sessionStorage.getItem('selectedSessAlbum');
const initialPricesSelectedSessAlbum = sessionStorage.getItem('pricesSelectedSessAlbum');


const initialState: sessAlbumState = {
  sess: [],
  newSess: initialNewSess ? JSON.parse(initialNewSess) : null,
  newSessDetails: null,
  newPrices: initialNewPrices ? JSON.parse(initialNewPrices) : null,
  videos: false,
  dividedToWaves: false,
  status: 'idle',
  selectedSessAlbum: initialSelectedSessAlbum ? JSON.parse(initialSelectedSessAlbum) : null,
  pricesSelectedSessAlbum: initialPricesSelectedSessAlbum ? JSON.parse(initialPricesSelectedSessAlbum) : null,
  next: null,
  previous: null,
  
};



export const fetchPricesBySessionAlbumId = createAsyncThunk(
  'cart/fetchPricesBySessionAlbumId',
  async (albumId: number) => {
      const response = await getPricesBySess(albumId);
      return response.data;
  }
);






export const formatSessDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true, // 12-hour clock
  };
  const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);
  return `${formattedDate} , ${formattedTime}`;
};




export const shortFormatSessDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false, // 12-hour clock
  };
  const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);
  return `${formattedDate} , ${formattedTime}`;
};



export const sessGetDataAsync = createAsyncThunk<
  { data: sess[], next: string | null, previous: string | null },  // Adjusted return type
  FetchParams
>(
  'sessAlbum/fetchImages',
  async ({ filterType, filterId, page = 1, pageSize = 21 }: FetchParams) => {
    let response;

    switch (filterType) {
      case 'photographer':
        if (filterId !== undefined) {
          response = await sessAlbumsByPhotographer(filterId, page, pageSize);
        } else {
          console.log("filter id is undefined");
          response = { data: [] }; // Provide an empty default response if filterId is undefined
        }
        break;
      case 'spot':
        if (filterId !== undefined) {
          response = await sessAlbumsBySpot(filterId, page, pageSize);
        } else {
          response = { data: [] }; // Provide an empty default response if filterId is undefined
        }
        break;
      default:
        response = await allSessAlbum(page, pageSize); // Pass pagination parameters here
        break;
    }

    const responseData = response?.data || [];
    const data = responseData.results || []; // Adjust according to the structure of your paginated response

    return {
      data: data.map((item: { sessDate: Date }) => ({
        ...item,
        formatSessDate: formatSessDate(String(item.sessDate)),
      })),
      next: response.data.next || null,
      previous: response.data.previous || null,
    };
  }
);




export const fetchSessAlbumByIdAsync = createAsyncThunk(
  'sessAlbum/fetchSessAlbumById',
  async (session_album: number) => {
    const response = await sessById(session_album);
    return response.data;
  }
);






export const createSessAlbumAsync = createAsyncThunk(
  'sessAlbum/createSessAlbum',
  async (credentials: { sessDate: Date, spot: number, photographer: number, cover_image: string, videos: boolean }) => {
    const response = await createSessAlbum(credentials);
    return response.data;
  }
);



export const updatePricesAsync = createAsyncThunk('updatePrices', async (credentials: {session_album: number, price_1_to_5: number,  price_6_to_50:number, price_51_plus:number  }) => {
  console.log("updatePrices asynchronously");
  const response = await updatePrices(credentials);
  return response.data; 
});


export const updatePricesForVideosAsync = createAsyncThunk('updatePricesForVideos', async (credentials: {session_album: number, price_1_to_3: number, price_4_to_15: number, price_16_plus:number  }) => {
  console.log("updatePricesForVideos asynchronously");
  const response = await updatePricesForVideos(credentials);
  return response.data; 
});




// Create an async thunk for deactivating a session album
export const deactivateSessionAlbumThunk = createAsyncThunk(
  'sessionAlbum/deactivate',
  async (sessionAlbumId: number) => {
    const response = await deactivateSessionAlbum(sessionAlbumId);
      return response; 
  }
);



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
    removeNewSess: (state) => {
      state.newSess = null;
      sessionStorage.removeItem('newSess');
    },
    removeNewSessDetails: (state) => {
      state.newSessDetails = null;
    },
    removeNewPrices: (state) => {
      state.newPrices = null;
      sessionStorage.removeItem('newPrices');
    },
    clearSessAlbums: (state) => {
      state.sess = [];
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(sessGetDataAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(sessGetDataAsync.fulfilled, (state, action) => {
      console.log(action.payload);
      
      state.sess = action.payload.data; // Adjust based on your API response
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.status = 'succeeded';
    })
    .addCase(sessGetDataAsync.rejected, (state) => {
      state.status = 'failed';
    })





    .addCase(fetchSessAlbumByIdAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchSessAlbumByIdAsync.fulfilled, (state, action) => {
      state.newSessDetails = action.payload;  // Update newSessDetails with the response
      sessionStorage.setItem('newSessDetails', JSON.stringify(state.newSessDetails));  // Optionally store it in sessionStorage
      console.log(state.newSessDetails);  // Log the details
      state.status = 'succeeded';
    })
    .addCase(fetchSessAlbumByIdAsync.rejected, (state, action) => {
      state.status = 'failed';
    })




      .addCase(createSessAlbumAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createSessAlbumAsync.fulfilled, (state, action) => {
        state.newSess = action.payload;
        sessionStorage.setItem('newSess', JSON.stringify(state.newSess));
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
        state.newPrices = action.payload;
        sessionStorage.setItem('newPrices', JSON.stringify(state.newPrices));
        console.log("prices in the slicer: ", state.newPrices);
        
        state.status = 'succeeded';
      })
      .addCase(updatePricesAsync.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(updatePricesForVideosAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePricesForVideosAsync.fulfilled, (state, action) => {
        state.newPrices = action.payload;
        sessionStorage.setItem('newPrices', JSON.stringify(state.newPrices));
        console.log("prices, from the slicer: " , state.newPrices);
        state.status = 'succeeded';
      })
      .addCase(updatePricesForVideosAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchPricesBySessionAlbumId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPricesBySessionAlbumId.fulfilled, (state, action) => {
        state.pricesSelectedSessAlbum = action.payload;
        console.log("state.prices: " , state.pricesSelectedSessAlbum);
        
        state.status = 'succeeded';
      })
      .addCase(fetchPricesBySessionAlbumId.rejected, (state) => {
        state.status = 'failed';
      });
      
  },
});

export const {clearSessAlbums,setSelectedSessAlbum, removeSelectedSessAlbum , removeNewSess , removeNewPrices, removeNewSessDetails} = sessAlbumSlice.actions;

export const selectSessAlbums = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.sess;
export const selectNewSess = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.newSess;
export const selectNewSessDetails = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.newSessDetails;
export const selectNewPrices = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.newPrices;
export const selectVideos = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.videos;
export const selectDividedToWaves = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.dividedToWaves;
export const selectSelectedSessAlbum = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.selectedSessAlbum;
export const selectNextPage = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.next;
export const selectPreviousPage = (state: { sessAlbum: sessAlbumState }) => state.sessAlbum.previous;

export default sessAlbumSlice.reducer;