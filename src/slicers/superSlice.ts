import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from '../services/superAPI';

interface Product {
  id: number;
  prodName: string;
  price: number;
}

interface SuperState {
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
  }
  
  const initialState: SuperState = {
    products: [],
    status: 'idle',
  };

export const getDataAsync = createAsyncThunk('super/fetchProducts', async () => {
  const response = await fetchProducts();
  return response.data;
});

export const superSlice = createSlice({
  name: 'super',
  initialState,
  reducers: {
    buy: (state, action: PayloadAction<Product>) => {
      console.log(action.payload.prodName);
      // Assuming you have a "myCart" property in your state
      state.products.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.pending, (state) => {
        // Assuming you have a "status" property in your state
        state.status = 'loading';
      })
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const { buy } = superSlice.actions;
export const selectProduct = (state: { super: SuperState }) => state.super.products;
export default superSlice.reducer;
