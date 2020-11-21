import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../queries";
import AppContext from "../../context/AppContext";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [favGenre, setFavGenre] = React.useState("");
  const [error, setError] = React.useState(null);

  const history = useHistory();

  const auth = React.useContext(AppContext);

  const [createUser, result] = useMutation(CREATE_USER, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  React.useEffect(() => {
    if (result.data) {
      const { token, user } = result.data.createUser;
      auth.login(token, user);
    }
  }, [auth, result]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    createUser({
      variables: { username, fullname, password, favoriteGenre: favGenre },
    });
    if (result.data && !result.error) {
      history.push("/");
    }
  };
  return (
    <div className="w-11/12 mx-auto my-5 p-3 md:w-3/6">
      <h2 className="text-center font-bold text-lg lg:text-2xl my-2 uppercase">
        Create your free account
      </h2>
      {error && (
        <div className="rounded-lg w-full md:w-8/12 mx-auto py-2 px-2 font-bold text-base text-white bg-red-600">
          {error}
        </div>
      )}
      <form
        className="w-full bg-gray-400 border-gray-600 border-2 mt-5 p-3 flex flex-col items-center"
        onSubmit={handleFormSubmit}
      >
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            fullname
          </label>
          <input
            required
            className="p-2 text-base rounded-md border-transparent outline-none"
            type="text"
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
          />
        </div>
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            username
          </label>
          <input
            required
            className="p-2 text-base rounded-md border-transparent outline-none"
            type="text"
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
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            favourite Genre
          </label>
          <input
            required
            className="p-2 text-base rounded-md border-transparent outline-none"
            type="text"
            value={favGenre}
            onChange={({ target }) => setFavGenre(target.value)}
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
