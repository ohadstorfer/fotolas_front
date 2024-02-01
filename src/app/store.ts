import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import signInReducer  from '../slicers/sighnInSlice'
import imagesReducer from '../slicers/ImagesSlice';
import perAlbumReducer from '../slicers/perAlbumSlice';
import sessAlbumReducer from '../slicers/sessAlbumSlice';
import photographerReducer from '../slicers/photographerSlice';
import spotReducer from '../slicers/spotSlice';
import signUpReducer from '../slicers/signUpSlice'
import profilePhotographerReducer from '../slicers/profilePtgSlice';
import userReducer from '../slicers/userSlice';
import becomePhotographerReducer from '../slicers/becomePhotographerSlice';
import uploadAlbumReducer from '../slicers/uploadPerAlbum';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    signIn: signInReducer ,
    signUp: signUpReducer,
    images: imagesReducer, 
    perAlbum: perAlbumReducer,
    sessAlbum:sessAlbumReducer,
    photographer: photographerReducer,
    profilePhotographer: profilePhotographerReducer,
    spot: spotReducer,
    user: userReducer,
    becomePhotographer: becomePhotographerReducer,
    uploadAlbum: uploadAlbumReducer, // Corrected name

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
