import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId =
  "96337949620-36lrmcsg5ui4lgmi3sa8227kek1i6gkc.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={googleClientId}>
      <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
