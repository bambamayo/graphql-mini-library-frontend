import { useApolloClient } from "@apollo/client";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import AppContext from "../../context/AppContext";
import Authors from "../Authors";
import Books from "../Books";
import Layout from "../Layout";
import NewBook from "../NewBook";

import Signin from "../Signin";
import Signup from "../Signup";

export default function App() {
  const [token, setToken] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const client = useApolloClient();

  React.useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const login = React.useCallback((token, user) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  }, [client]);

  const handleAlert = React.useCallback((alert) => {
    setAlert(alert);
  }, []);

  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route exact path={ROUTES.HOME}>
          <Books />
        </Route>
        <Route path={ROUTES.AUTHORS}>
          <Authors />
        </Route>
        <Route path={ROUTES.SIGN_IN}>
          <Signin />
        </Route>
        <Route path={ROUTES.SIGN_UP}>
          <Signup />
        </Route>
        <Redirect to={ROUTES.HOME} />
      </Switch>
    );
  } else if (token) {
    routes = (
      <Switch>
        <Route exact path={ROUTES.HOME}>
          <Books />
        </Route>
        <Route path={ROUTES.AUTHORS}>
          <Authors />
        </Route>
        <Route path={ROUTES.NEWBOOK}>
          <NewBook />
        </Route>
        <Redirect to={ROUTES.HOME} />
      </Switch>
    );
  }

  return (
    <AppContext.Provider value={{ token, login, logout, alert, handleAlert }}>
      <Router>
        <Layout>{routes}</Layout>
      </Router>
    </AppContext.Provider>
  );
}
