import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const Root = () => (
  <div className="dark:bg-gray-900 min-h-screen max-w-screen">
    <App />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);