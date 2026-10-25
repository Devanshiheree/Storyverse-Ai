// ============================================================
// MAIN ENTRY POINT
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { AppProvider } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider must be outermost so AppProvider can read the user */}
    <AuthProvider>
      {/* AppProvider uses auth state to subscribe to the right Firestore data */}
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </StrictMode>,
)
