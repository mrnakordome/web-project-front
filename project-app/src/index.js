// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Import the App component

import './styles/adminmain.css'; // Import Admin Main Page CSS
import './styles/loginmenu.css'; // Import Login Menu CSS

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <App /> {/* Render the App component within Router */}
    </Router>
  </React.StrictMode>
);
