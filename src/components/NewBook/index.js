import React from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS } from "../../queries";

export default function NewBook() {
  const [title, setTitle] = React.useState("");
  const [author, setAuhtor] = React.useState("");
  const [published, setPublished] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [genres, setGenres] = React.useState([]);
  const [alert, setAlert] = React.useState(null);

  const client = useApolloClient();

  React.useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [alert]);

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  const [createBook, result] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setAlert(error.graphQLErrors[0].message);
    },
    update: (store, response) => {
      updateCacheWith(response.data.addBook);
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      author,
      published: Number(published),
      genres,
    };

    createBook({ variables: { data } });

    setAlert("New book added successfully");

    setTitle("");
    setPublished("");
    setAuhtor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = React.useCallback(() => {
    setGenres(genres.concat(genre));
    setGenre("");
  }, [genre, genres]);

  return (
    <div className="w-11/12 mx-auto my-3 p-3 md:w-3/6">
      <h2 className="text-center font-bold text-lg lg:text-xl my-2 uppercase">
        Add new book
      </h2>
      {alert && (
        <div
          className={`rounded-lg w-full md:w-8/12 mx-auto py-2 px-2 font-bold text-base text-white ${
            result.error ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {alert}
        </div>
      )}
      <form
        className="w-full bg-gray-400 border-gray-600 border-2 mt-5 p-3 flex flex-col items-center"
        onSubmit={submit}
      >
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">title</label>
          <input
            required
            className="p-1 text-base rounded-md border-transparent outline-none"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            author
          </label>
          <input
            required
            className="p-1 text-base rounded-md border-transparent outline-none"
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div className="mb-3 w-full p-2 flex flex-col">
          <label className="inline-block font-bold text-base mb-2">
            published
          </label>
          <input
            required
            className="p-1 text-base rounded-md border-transparent outline-none"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="mb-3 w-full p-2 flex">
          <input
            required
            className="p-1 w-1/2 text-base rounded-md border-transparent outline-none"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button
            className="text-white w-1/2 text-base bg-red-500 p-2 hover:opacity-70 transition-all duration-100 ease-in rounded-md"
            onClick={addGenre}
            type="button"
          >
            add genre
          </button>
        </div>
        <div className="mb-3 w-full p-2 font-bold text-base">
          genres: {genres.join(" ")}
        </div>
        <button
          className={`w-full text-white text-base bg-red-500 p-2 hover:opacity-70 transition-all duration-100 ease-in rounded-md ${
            result.loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={result.loading}
          type="submit"
        >
          create book
        </button>
      </form>
    </div>
  );
}
