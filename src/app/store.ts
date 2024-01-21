import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import sighnInReducer from '../slicers/sighnInSlice'
import imagesReducer from '../slicers/ImagesSlice';
import perAlbumReducer from '../slicers/perAlbumSlice';
import sessAlbumReducer from '../slicers/sessAlbumSlice';
import photographerReducer from '../slicers/photographerSlice';
import spotReducer from '../slicers/spotSlice';
import signUpReducer from '../slicers/signUpSlice'
import profilePhotographerReducer from '../slicers/profilePtgSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    sighnIn: sighnInReducer,
    signUp: signUpReducer,
    images: imagesReducer, 
    perAlbum: perAlbumReducer,
    sessAlbum:sessAlbumReducer,
    photographer: photographerReducer,
    profilePhotographer: profilePhotographerReducer,
    spot: spotReducer,
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
