import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sipSlice from "./slices/sipSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""], // Only persist the sip reducer
};

const persistedReducer = persistReducer(persistConfig, sipSlice);

export const store = configureStore({
  reducer: {
    sip: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
