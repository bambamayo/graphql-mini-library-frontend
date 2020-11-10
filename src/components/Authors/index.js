import React from "react";
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";
import { ALL_AUTHORS, AUTHOR_EDITED, EDIT_AUTHOR } from "../../queries";
import AppContext from "../../context/AppContext";

export default function Authors() {
  const [name, setName] = React.useState("");
  const [born, setBorn] = React.useState("");
  const [alert, setAlert] = React.useState("");

  const auth = React.useContext(AppContext);
  const client = useApolloClient();

  const updateCacheWith = (editedAuthor) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_AUTHORS });
    if (!includedIn(dataInStore.allAuthors, editedAuthor)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: dataInStore.allAuthors.concat(editedAuthor) },
      });
    }
  };

  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [authorEdit, mutation] = useMutation(EDIT_AUTHOR, {
    update: (store, response) => {
      updateCacheWith(response.data.editAuthor);
    },
  });

  useSubscription(AUTHOR_EDITED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const editedAuthor = subscriptionData.data.authorEdited;
      setAlert(`${editedAuthor.name} born year was updated`);
      updateCacheWith(editedAuthor);
    },
  });

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
      {alert && (
        <div>
          {alert}
          <span>&times;</span>
        </div>
      )}
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
            <button disabled={mutation.loading} type="submit">
              update author
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
