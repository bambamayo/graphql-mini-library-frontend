import React from "react";
import { NavLink, Link } from "react-router-dom";
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
          <ul className="flex w-3/5 md:w-3/12 justify-between items-center">
            <li className="text-xs md:text-sm font-bold text-gray-700">
              <NavLink
                activeClassName="opacity-70"
                className="hover:opacity-70 transition-all duration-100 ease-in"
                to={ROUTES.AUTHORS}
              >
                Authors
              </NavLink>
            </li>

            {auth.token && (
              <li className="text-xs md:text-sm font-bold text-gray-700">
                <NavLink
                  activeClassName="opacity-70"
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.NEWBOOK}
                >
                  Newbook
                </NavLink>
              </li>
            )}

            {!auth.token && (
              <li className="text-xs md:text-sm font-bold text-gray-700">
                <NavLink
                  activeClassName="opacity-70"
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.SIGN_IN}
                >
                  Sign in
                </NavLink>
              </li>
            )}
            {!auth.token && (
              <li className="text-xs md:text-sm font-bold text-gray-700">
                <NavLink
                  activeClassName="opacity-70"
                  className="hover:opacity-70 transition-all duration-100 ease-in"
                  to={ROUTES.SIGN_UP}
                >
                  Sign up
                </NavLink>
              </li>
            )}
            {auth.token && (
              <li className="text-xs md:text-sm font-bold text-white">
                <button
                  activeClassName="opacity-70"
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
