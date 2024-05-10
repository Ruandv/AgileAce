import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatRoom from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

root.render(
  <React.StrictMode>
    <ChatRoom />
  </React.StrictMode>
);
