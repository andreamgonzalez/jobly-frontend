import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./routes-nav/NavBar";
import Routes from "./routes-nav/Routes";
import UserContext from "./auth/UserContext";
import JoblyApi from "./api/api";
import jwt from "jsonwebtoken";
import Home from './home/home';


// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-token";


function App() {

  return (
    <BrowserRouter>
      <UserContext.Provider
          value="">
        <div className="App">
          <NavBar />
          <Home></Home>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
);
}

export default App;
