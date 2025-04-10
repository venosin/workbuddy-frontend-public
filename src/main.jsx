import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'
import App from './App.jsx'

// Configuración de PayPal
const paypalOptions = {
  "client-id": "AXi20AtF43WwKRsQ_iqIxGjdMN_WZKPD3E-hnLMfkD6oK_wGPQbsoyJo9ZQPybVts3QCDBiWPZ0J07aa", // Tu client-id de PayPal Sandbox
  currency: "USD",
  intent: "capture"
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PayPalScriptProvider options={paypalOptions}>
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </StrictMode>,
)
