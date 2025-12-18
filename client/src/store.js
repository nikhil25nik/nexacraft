import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from "./redux/user/user.slice.js"

import sessionStorage from "redux-persist/es/storage/session"
import { persistReducer, persistStore } from "redux-persist"

// 1. Root Reducer
const rootReducer = combineReducers({
   user: userReducer
})

// 2. Persist Config
const persistConfig = {
  key: 'root',
  storage: sessionStorage,
}

// 3. Persisted Reducer (Rename to avoid conflict)
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 4. Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// 5. Persistor
export const persistor = persistStore(store)
