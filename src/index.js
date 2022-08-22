import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Settings from './Components/Settings';
import Dashboard from './Components/Dashboard';
import Classes from './Components/Classes'
import ClassPage from './Components/ClassPage';
import Login from './Components/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<App />} />
  //     <Route path="dashboard" element={<Dashboard />} />
  //     <Route path="settings" element={<Settings />} />
  //     <Route path="classes" element={<Classes />} />
  //     <Route path="class/:id" element={<ClassPage />} />
  //     <Route path="login" element={<Login />} />
  //   </Routes>
  // </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
