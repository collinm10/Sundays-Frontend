import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Settings from './Components/Settings';
import Dashboard from './Components/Dashboard';
import Classes from './Components/Classes'
import ClassPage from './Components/ClassPage';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Navibar from './Components/Navibar';

function App() {
  const token = getToken();
  const [refresh, setRefresh] = useState();

  console.log(token);
  if(!token){
    console.log("Not logged in...")
    return <Login setRefresh={setRefresh}/>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="classes" element={<Classes />} />
          <Route path="class/:id" element={<ClassPage />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
function setToken(userToken){
  localStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = localStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken;
}

export default App;
