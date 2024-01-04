import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import sighnInReducer from '../slicers/sighnInSlice'
import imagesReducer from '../slicers/ImagesSlice';
import perAlbumReducer from '../slicers/perAlbumSlice';
import sessAlbumReducer from '../slicers/sessAlbumSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    sighnIn: sighnInReducer,
    images: imagesReducer, 
    perAlbum: perAlbumReducer,
    sessAlbum:sessAlbumReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
