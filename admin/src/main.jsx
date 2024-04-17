import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* By doing this we will get BrowserRouter support for our admin react project */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
