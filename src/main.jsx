import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// TỰ ĐỘNG XÓA localStorage MỖI LẦN CHẠY DEV
if (import.meta.env.DEV) {
  localStorage.clear();
  console.log('localStorage đã được xóa (DEV mode)');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
