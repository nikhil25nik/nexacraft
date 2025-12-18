import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { persistor, store } from './store.js'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
       <PersistGate loading={<div>Loading...</div>} persistor={persistor}>

          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
