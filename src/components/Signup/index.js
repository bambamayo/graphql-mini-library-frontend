import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../queries";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [favGenre, setFavGenre] = React.useState("");
  const [error, setError] = React.useState(null);

  const history = useHistory();

  const auth = React.useContext(AuthContext);

  const [createUser, result] = useMutation(CREATE_USER, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

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
    <div>
      <h2>Create your free account</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>fullname</label>
          <input
            type="text"
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
          />
        </div>
        <div>
          <label>username</label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label>password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <label>favourite Genre</label>
          <input
            type="text"
            value={favGenre}
            onChange={({ target }) => setFavGenre(target.value)}
          />
        </div>
        <div>
          <button disabled={result.loading}>sign in</button>
        </div>
      </form>
    </div>
  );
}
