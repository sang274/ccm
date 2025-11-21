import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// TỰ ĐỘNG XÓA localStorage MỖI LẦN CHẠY DEV
// if (import.meta.env.DEV) {
//   localStorage.clear();
//   console.log('localStorage đã được xóa (DEV mode)');
// }

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #dc2626; margin-bottom: 10px;">Application Error</h1>
        <p style="color: #6b7280;">${error.message}</p>
        <p style="color: #9ca3af; margin-top: 10px;">Check the console for more details.</p>
      </div>
    </div>
  `;
}
