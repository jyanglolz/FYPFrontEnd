import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL = `http://127.0.0.1:8000`;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
