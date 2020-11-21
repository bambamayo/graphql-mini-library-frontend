import React, { useEffect } from "react";
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
  const [alert, setAlert] = React.useState(null);

  const auth = React.useContext(AppContext);
  const client = useApolloClient();

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [alert]);

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
  const [authorEdit, result] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      setAlert("Could not update author, please check author name");
    },
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

  const submit = async (e) => {
    e.preventDefault();

    authorEdit({ variables: { name, setBornTo: Number(born) } });

    if (result.data && !result.error) {
      setAlert("Author edited successfully");
    }

    setName("");
    setBorn("");
  };

  if (loading) {
    return (
      <div className="container p-3 text-base md:text-lg lg:text-lg font-bold">
        loadinggg
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-3 font-bold text-base md:text-lg lg:text-lg text-red-600">
        Could not fetch authors
      </div>
    );
  }

  return (
    <div className="w-full md:w-8/12 mx-auto my-2 md:my-5 p-3">
      {alert && (
        <div
          className={`rounded-lg w-full md:w-8/12 mx-auto py-2 px-2 font-bold text-base text-white ${
            result.error ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {alert}
        </div>
      )}
      <h2 className="text-center font-bold text-lg md:text-4xl my-2 uppercase">
        Authors
      </h2>
      <table className="w-full text-sm md:text-base text-left md:text-center shadow-xl mb-10 p-2 h-auto overflow-auto border-b-2 border-black">
        <tbody>
          <tr className="p-2">
            <th>Name</th>
            <th>Born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((author) => (
            <tr key={author.id} className="border-gray-800 border-b-2 p-2">
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {auth.token && (
        <div className="w-11/12 mx-auto my-3 p-3 md:w-3/6">
          <h2 className="text-center font-bold text-lg lg:text-xl my-2 uppercase">
            Set birthyear
          </h2>
          <form
            className="w-full bg-gray-400 border-gray-600 border-2 mt-5 p-3 flex flex-col items-center"
            onSubmit={submit}
          >
            <div className="mb-3 w-full p-2 flex flex-col">
              <label className="inline-block font-bold text-base mb-2">
                name
              </label>
              <input
                required
                className="p-1 text-base rounded-md border-transparent outline-none"
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </div>
            <div className="mb-3 w-full p-2 flex flex-col">
              <label className="inline-block font-bold text-base mb-2">
                born
              </label>
              <input
                required
                className="p-1 text-base rounded-md border-transparent outline-none"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <div className="mb-3 w-full p-2">
              <button
                className={`w-full text-white text-base bg-red-500 p-2 hover:opacity-70 transition-all duration-100 ease-in rounded-md ${
                  result.loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={result.loading}
                type="submit"
              >
                update author
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
