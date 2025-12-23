
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import AuthProvider from './Component/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import createStore from "./Store/create-store.js"
import { Provider } from 'react-redux'
const store=createStore();
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Provider store={store}>
 <AuthProvider>
    <App />
 </AuthProvider>
 </Provider>
 </BrowserRouter>


)
