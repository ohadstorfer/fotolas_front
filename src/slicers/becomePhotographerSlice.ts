import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { becomePhotographer, fetchDefaultPricesForImages, fetchDefaultPricesForVideos, updateDefaultAlbumPricesForImages, updateDefaultAlbumPricesForVideos, updatePhotographer } from '../services/becomePhotographerAPI';

// Define the Pricing interface

interface imagesPricing {
  photographer: number;
  price_1_to_5: number;
  price_6_to_50: number;
  price_51_plus: number;
}

interface videosPricing {
  photographer: number;
  price_1_to_3: number;
  price_4_to_15: number;
  price_16_plus: number;
}


interface becPhotogState {
  newPhotographer: boolean
  updatePhotographer: boolean
  error: string | null;
  newDefaultAlbumPricesImages: {} | null;
  newDefaultAlbumPricesVideos: {} | null;
  defaultAlbumPricesImages: imagesPricing[]  | null;
  defaultAlbumPricesVideos: videosPricing[]  | null;

}

const initialState: becPhotogState = {
  newPhotographer: false,
  updatePhotographer: false,
  newDefaultAlbumPricesImages: null,
  newDefaultAlbumPricesVideos: null,
  defaultAlbumPricesImages: null,
  defaultAlbumPricesVideos: null,
  error: null,
};


export const becomePhotographerAsync = createAsyncThunk('becPhotog', async (credentials: { user: number, about: string, profile_image: string  }) => {
  console.log("doing becomePhotographerAsync");
  
  const response = await becomePhotographer(credentials);
  return response.data;
});



export const updatePhotographerAsync = createAsyncThunk(
  'updatePhotographer', 
  async (credentials: { photographerId: number, user: number, about: string, profile_image: string }) => {
    console.log("doing updatePhotographerAsync");
    // Make the API call to update the photographer
    const response = await updatePhotographer(credentials);
    // Return the data from the response
    return response.data;
  }
);



export const updateDefaultAlbumPricesForImagesAsync = createAsyncThunk(
  'updateDefaultAlbumPricesForImages',
  async (credentials: { photographer: number, price_1_to_5: number, price_6_to_50: number, price_51_plus: number }) => {
    console.log("Updating default album prices for images");
    const response = await updateDefaultAlbumPricesForImages(credentials);
    return response.data;
  }
);


export const updateDefaultAlbumPricesForVideosAsync = createAsyncThunk(
  'updateDefaultAlbumPricesForVideos',
  async (credentials: { photographer: number, price_1_to_3: number, price_4_to_15: number, price_16_plus: number }) => {
    console.log("Updating default album prices for videos");
    const response = await updateDefaultAlbumPricesForVideos(credentials);
    return response.data;
  }
);





// Async thunk for fetching default album prices for images
export const fetchDefaultAlbumPricesImages = createAsyncThunk(
  'photographer/fetchDefaultAlbumPricesImages',
  async (photographerId: number) => {
    const response = await fetchDefaultPricesForImages(photographerId);
    return response;  // Adjust according to your API response structure
  }
);

// Async thunk for fetching default album prices for videos
export const fetchDefaultAlbumPricesVideos = createAsyncThunk(
  'photographer/fetchDefaultAlbumPricesVideos',
  async (photographerId: number) => {
    const response = await fetchDefaultPricesForVideos(photographerId);
    return response;  // Adjust according to your API response structure
  }
);







const becomePhotographerSlice = createSlice({
  name: 'becomePhotographer',
  initialState,
  reducers: {
    resetUpdatedPhotographer: (state) => {
    state.updatePhotographer = false
  },
  resetNewDefaultAlbumPricesImages: (state) => {
    state.newDefaultAlbumPricesImages = null
  },
  resetNewDefaultAlbumPricesVideos: (state) => {
    state.newDefaultAlbumPricesVideos = null
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(becomePhotographerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(becomePhotographerAsync.fulfilled, (state, action) => {
        state.newPhotographer = true
        state.error = null;
      })
      .addCase(becomePhotographerAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(updatePhotographerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updatePhotographerAsync.fulfilled, (state, action) => {
        state.updatePhotographer = true
        console.log(state.updatePhotographer);
        state.error = null;
      })
      .addCase(updatePhotographerAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';
      })


      .addCase(updateDefaultAlbumPricesForImagesAsync.pending, (state) => {
        state.error = null;  // Clear any previous errors
      })
      .addCase(updateDefaultAlbumPricesForImagesAsync.fulfilled, (state, action) => {
        state.newDefaultAlbumPricesImages = action.payload;  // Store the updated prices
      })
      .addCase(updateDefaultAlbumPricesForImagesAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';  // Handle the error
      })


      .addCase(updateDefaultAlbumPricesForVideosAsync.pending, (state) => {
        state.error = null;  // Clear any previous errors
      })
      .addCase(updateDefaultAlbumPricesForVideosAsync.fulfilled, (state, action) => {
        state.newDefaultAlbumPricesVideos = action.payload;  // Store the updated prices
      })
      .addCase(updateDefaultAlbumPricesForVideosAsync.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred';  // Handle the error
      })


      .addCase(fetchDefaultAlbumPricesImages.fulfilled, (state, action) => {
        state.defaultAlbumPricesImages = action.payload;
        console.log(state.defaultAlbumPricesImages);
      })
      .addCase(fetchDefaultAlbumPricesVideos.fulfilled, (state, action) => {
        state.defaultAlbumPricesVideos = action.payload;
      })
      .addCase(fetchDefaultAlbumPricesImages.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch default album prices for images';
      })
      .addCase(fetchDefaultAlbumPricesVideos.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch default album prices for videos';
      })

      ;
  },
});


export const { resetUpdatedPhotographer,resetNewDefaultAlbumPricesImages,resetNewDefaultAlbumPricesVideos } = becomePhotographerSlice.actions;


export const selectBecomePhotographer = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.newPhotographer;
export const selectUpdatePhotographer = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.updatePhotographer;

export const selectDefaultAlbumPricesImages = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.defaultAlbumPricesImages;
export const selectDefaultAlbumPricesVideos = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.defaultAlbumPricesVideos;

export const selectNewDefaultAlbumPricesImages = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.newDefaultAlbumPricesImages;
export const selectNewDefaultAlbumPricesVideos = (state: { becomePhotographer: becPhotogState }) => state.becomePhotographer.newDefaultAlbumPricesVideos;
export default becomePhotographerSlice.reducer;
