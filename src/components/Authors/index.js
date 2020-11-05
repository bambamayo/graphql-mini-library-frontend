import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../../queries";
import AuthContext from "../../context/AuthContext";

export default function Authors() {
  const [name, setName] = React.useState("");
  const [born, setBorn] = React.useState("");

  const auth = React.useContext(AuthContext);

  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [authorEdit, mutation] = useMutation(EDIT_AUTHOR);

  const submit = (e) => {
    e.preventDefault();

    authorEdit({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  if (loading) {
    return <div>loadinggg</div>;
  }

  if (error) {
    return <div>Could not fetch authors</div>;
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {auth.token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              name
              <input
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
}
