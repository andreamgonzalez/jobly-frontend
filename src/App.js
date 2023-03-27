import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import NavBar from "./routes-nav/NavBar";
import Routes from "./routes-nav/Routes";
import UserContext from "./auth/UserContext";
import JoblyApi from "./api/api";
import jwt from "jsonwebtoken";
import LoadingSpinner from "./common/LoadingSpinner";


// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-app-token";


function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // token is a property for the Api class so that it can be reference when API is called.
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getUser(username);
          setCurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // infoLoaded to false while awaitng the async getCurrentUser function for loading spinner ui handling
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

    /** Handles user logout. */
    function logout() {
      setCurrentUser(null);
      setToken(null);
    }

    /** Handles signup for user account, automatically logs in upon creation. */
    async function signup(signupData) {
      try {
        let token = await JoblyApi.signup(signupData);
        setToken(token);
        return { success: true };
      } catch (errors) {
        console.error("signup failed", errors);
        return { success: false, errors };
      }
    }

    /** Handles existing user login. */
    async function login(loginData) {
      try {
        let token = await JoblyApi.login(loginData);
        setToken(token);
        
        return { success: true };
      } catch (errors) {
        console.error("login failed", errors);
        return { success: false, errors };
      }
    }

    /** Checks if a job has been applied for. */
    function hasAppliedToJob(id) {
      return applicationIds.has(id);
    }
  
    /** Handles application to a job: makes API call and updates set of application IDs. */
    function applyToJob(id) {
      if (hasAppliedToJob(id)) return;
      JoblyApi.applyToJob(currentUser.username, id);
      setApplicationIds(new Set([...applicationIds, id]));
    }
  
    if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{currentUser, setCurrentUser, hasAppliedToJob, applyToJob }} >
        <div className="App">
          <NavBar logout={logout}/>
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
