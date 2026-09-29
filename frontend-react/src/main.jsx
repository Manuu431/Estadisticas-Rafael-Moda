import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './config/axios.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
    <App />
)