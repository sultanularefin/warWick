import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import authReducer, {
  clearCredentials,
  setCredentials,
  setHydrated,
} from './features/auth/authSlice.ts';
import { apiSlice } from './features/api/apiSlice.ts';
/*import authReducer, {
  setCredentials,
  clearCredentials,
  setHydrated,
} from '../features/auth/authSlice';
import { apiSlice } from '../features/api/apiSlice';*/

const listener = createListenerMiddleware();
const storage = createMMKV();
listener.startListening({
  matcher: setCredentials.match,
  effect: async action =>{
    // const storage = createMMKV();
    //AsyncStorage.setItem('auth', JSON.stringify(action.payload)),

    storage.set('auth', JSON.stringify(action.payload));
      // storage.set('user.name', 'Marc');
  }


});
listener.startListening({
  matcher: clearCredentials.match,
  // effect: async () => AsyncStorage.removeItem('auth'),
  effect: async () => {
    storage.remove('auth');
  }
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: gDM =>
    gDM().prepend(listener.middleware).concat(apiSlice.middleware),
});

export const hydrateAuth = () => async (dispatch: typeof store.dispatch) => {
  try {
    // const raw = await AsyncStorage.getItem('auth');
    const raw = storage.getString('auth');

    if (raw) {
      const { token, user } = JSON.parse(raw);
      dispatch(setCredentials({ token, user }));
    }
  } finally {
    dispatch(setHydrated(true));
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
