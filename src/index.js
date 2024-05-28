import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';  // Ensure this file exists or remove this line if not used
import App from './App';  // Ensures App.js is correctly located in the src folder
import reportWebVitals from './reportWebVitals';  // Optional, only if using Web Vitals

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();