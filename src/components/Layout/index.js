import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import AppContext from "../../context/AppContext";

export default function Layout({ children }) {
  const auth = React.useContext(AppContext);

  return (
    <>
      <header className="h-10 shadow-md">
        <nav className="h-full w-11/12 md:container lg:container m-auto flex items-center justify-between">
          <div>
            <Link
              className="font-mono text-lg md:text-xl font-bold"
              to={ROUTES.HOME}
            >
              PubLibrary
            </Link>
          </div>
          <ul className="flex w-2/4 md:w-3/12 justify-between items-center">
            <li className="text-sm font-semibold text-gray-700">
              <Link
                className="hover:opacity-70 transition-all duration-100 ease-in"
                to={ROUTES.AUTHORS}
              >
                Authors
              </Link>
            </li>

            {auth.token && (
              <li className="text-sm font-semibold text-gray-700">
                <Link
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.NEWBOOK}
                >
                  Newbook
                </Link>
              </li>
            )}

            {!auth.token && (
              <li className="text-sm font-semibold text-gray-700">
                <Link
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.SIGN_IN}
                >
                  Sign in
                </Link>
              </li>
            )}
            {!auth.token && (
              <li className="text-sm font-semibold text-gray-700">
                <Link
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.SIGN_UP}
                >
                  Sign up
                </Link>
              </li>
            )}
            {auth.token && (
              <li className="text-sm font-semibold text-white">
                <button
                  className="bg-red-500 p-2 hover:opacity-70 transition-all duration-100 ease-in rounded-md"
                  onClick={auth.logout}
                >
                  log out
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
