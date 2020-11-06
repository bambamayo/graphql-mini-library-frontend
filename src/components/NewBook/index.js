import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS } from "../../queries";

export default function NewBook() {
  const [title, setTitle] = React.useState("");
  const [author, setAuhtor] = React.useState("");
  const [published, setPublished] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [genres, setGenres] = React.useState([]);
  const [error, setError] = React.useState(null);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error);
      setError(error.graphQLErrors[0].message);
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_BOOKS });
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, response.data.addBook],
        },
      });
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

    setTitle("");
    setPublished("");
    setAuhtor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={submit}>
        <div>
          <label>title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label>author</label>
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          <label>published</label>
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
}
