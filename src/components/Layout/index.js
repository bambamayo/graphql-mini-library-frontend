import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import AppContext from "../../context/AppContext";

export default function Layout({ children }) {
  const auth = React.useContext(AppContext);

  return (
    <>
      <header>
        <div>
          <Link to={ROUTES.HOME}>PubLibrary</Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to={ROUTES.AUTHORS}>Authors</Link>
            </li>
            {auth.token && (
              <li>
                <Link to={ROUTES.NEWBOOK}>New book</Link>
              </li>
            )}
            {!auth.token && (
              <li>
                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
              </li>
            )}
            {!auth.token && (
              <li>
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
              </li>
            )}
            {auth.token && (
              <li>
                <button onClick={auth.logout}>log out</button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
