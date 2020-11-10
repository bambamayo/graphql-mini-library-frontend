import React from "react";
import { useApolloClient, useMutation, useSubscription } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS, BOOK_ADDED } from "../../queries";

export default function NewBook() {
  const [title, setTitle] = React.useState("");
  const [author, setAuhtor] = React.useState("");
  const [published, setPublished] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [genres, setGenres] = React.useState([]);
  const [alert, setAlert] = React.useState(null);

  const client = useApolloClient();

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

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error);
      setAlert(error.graphQLErrors[0].message);
    },
    update: (store, response) => {
      updateCacheWith(response.data.addBook);
    },
  });

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      setAlert(`${addedBook.title} was added`);
      updateCacheWith(addedBook);
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

  const addGenre = React.useCallback(() => {
    setGenres(genres.concat(genre));
    setGenre("");
  }, [genre, genres]);

  return (
    <div>
      {alert && (
        <div>
          {alert}
          <span>&times;</span>
        </div>
      )}
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
