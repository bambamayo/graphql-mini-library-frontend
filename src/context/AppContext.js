import React from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  handleAlert: () => {},
  alert: null,
});

export default AuthContext;
