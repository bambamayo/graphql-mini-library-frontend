import React from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../queries";
import { useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Signin() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const history = useHistory();

  const auth = React.useContext(AuthContext);

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.error) {
      setError(result.error);
    }
    if (result.data) {
      const token = result.data.login.token;
      const user = result.data.login.user;
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
    <div>
      <h2>Sign in to your account</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleForSubmit}>
        <div>
          <label>username</label>
          <input
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
          <button disabled={result.loading}>sign in</button>
        </div>
      </form>
    </div>
  );
}
