import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import Emails from './pages/Emails.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Emails />
  </StrictMode>,
)
