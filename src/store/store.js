import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import homeSlice from "./homeSlice";
import userSlice from "./userSlice";

const persistConfig = {
  key: "root", // the key for the persisted data in storage
  storage, // the storage mechanism to use (localStorage)
  whitelist: ["user"], // an array of slice names to be persisted (only "user" in this case)
};

const rootReducer = combineReducers({
  home: homeSlice,
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store using the persisted reducer and customized middleware
// Configure the default middleware and ensure the redux-persist actions are ignored in the serializable check
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these redux-persist-specific actions to avoid serializability issues
      },
    }),
});

// persist refers to the functionality provided by the redux-persist library, which is used to save (persist) the Redux state to a storage medium (e.g., localStorage) and restore (rehydrate) it when the application is reloaded. This ensures that the Redux state is not lost when the user refreshes the page or closes and reopens the browser.
export const persistor = persistStore(store);
