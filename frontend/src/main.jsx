import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Prevent flash of unstyled content
const theme = localStorage.getItem('music-taskboard-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.add(theme);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);