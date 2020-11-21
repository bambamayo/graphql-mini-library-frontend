import React from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../queries";
import AppContext from "../../context/AppContext";
import { useHistory } from "react-router-dom";

export default function Signin() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const history = useHistory();

  const auth = React.useContext(AppContext);

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  React.useEffect(() => {
    if (result.data) {
      const { token, user } = result.data.login;
      auth.login(token, user);
    }
  }, [auth, result]);

  const handleForSubmit = async (e) => {
    e.preventDefault();

    login({ variables: { username, password } });
    if (result.data && !result.error) {
      history.push("/");
    }
  };

  return (
    <div className="w-11/12 mx-auto my-5 p-3 md:w-3/6">
      <h2 className="text-center font-bold text-lg lg:text-2xl my-2 uppercase">
        Sign in to your account
      </h2>
      {error && (
        <div className="rounded-lg w-full md:w-8/12 mx-auto py-2 px-2 font-bold text-base text-white bg-red-600">
          {error}
        </div>
      )}
      <form
        className="w-full bg-gray-400 border-gray-600 border-2 mt-5 p-3 flex flex-col items-center"
        onSubmit={handleForSubmit}
      >
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            username
          </label>
          <input
            required
            className="p-2 text-base rounded-md border-transparent outline-none"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            password
          </label>
          <input
            required
            className="p-2 text-base rounded-md border-transparent outline-none"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="mb-5 w-full p-2">
          <button
            className={`w-full text-white text-base bg-red-500 p-2 hover:opacity-70 transition-all duration-100 ease-in rounded-md ${
              result.loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={result.loading}
          >
            sign in
          </button>
        </div>
      </form>
    </div>
  );
}
