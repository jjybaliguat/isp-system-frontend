import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "../apiSlice"
import authReducer from "../authSlice"
import storage from 'redux-persist/lib/storage'
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
import {combineReducers } from '@reduxjs/toolkit'
import {useSelector, TypedUseSelectorHook, useDispatch} from 'react-redux'

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: [apiSlice.reducerPath]
}

const reducer = combineReducers({
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
})

const persistedReducer =  persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
    devTools: true
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch  = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector