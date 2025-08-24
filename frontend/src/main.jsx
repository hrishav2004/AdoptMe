import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDom from "react-dom/client"
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App/>
    </Router>
  </StrictMode>,
)
