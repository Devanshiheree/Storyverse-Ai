// ============================================================
// MAIN ENTRY POINT
// This is the very first file that runs when the app loads.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AppProvider wraps the whole app so all components share state */}
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
