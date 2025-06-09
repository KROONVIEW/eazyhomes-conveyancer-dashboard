import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles/style.css';
import App from './App';
import { initWebVitals } from './utils/webVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Initialize Web Vitals monitoring for performance tracking
initWebVitals();
