import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GoalBuddyApp from './GoalBuddyApp';

// Create root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main GoalBuddyApp inside React's StrictMode
root.render(
  <React.StrictMode>
    {/* Future enhancements like context/theme providers can be added here */}
    <GoalBuddyApp />
  </React.StrictMode>
);
