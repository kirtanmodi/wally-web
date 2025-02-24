import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import swpSlice from "./slices/swpSlice";
import sipSlice from "./slices/sipSlice";
import goalsSlice from "./slices/goalsSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sip"], // Only persist the sip reducer
};

const rootReducer = combineReducers({
  sip: sipSlice,
  swp: swpSlice,
  goals: goalsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
