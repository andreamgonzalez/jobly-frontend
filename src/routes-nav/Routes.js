import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../home/Home";
import LoginForm from "../auth/LoginForm";
import PrivateRoute from "./PrivateRoute";


function Routes( {login, signup} ){

    return (
        <div>
          <Switch>
  
            <Route exact path="/">
              <Home />
            </Route>
  
            <Route exact path="/login">
              <LoginForm login={login} />
            </Route>
  
            <Route exact path="/signup">
              {/* <SignupForm signup={signup} /> */}
            </Route>
  
            <PrivateRoute exact path="/companies">
              {/* <CompanyList /> */}
            </PrivateRoute>
  
            <PrivateRoute exact path="/jobs">
              {/* <JobList /> */}
            </PrivateRoute>
  
            <PrivateRoute exact path="/companies/:handle">
              {/* <CompanyDetail /> */}
            </PrivateRoute>
  
            <PrivateRoute path="/profile">
              {/* <ProfileForm /> */}
            </PrivateRoute>
  
            <Redirect to="/" />
          </Switch>
        </div>
    );
}

export default Routes;
