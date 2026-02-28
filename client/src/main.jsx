import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { BrowserRouter as Router } from 'react-router-dom';

import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')).render(
  <Router>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ variables: { colorPrimary: '#4f46e5' } }}>
      <App />
    </ClerkProvider>
  </Router>,
);
