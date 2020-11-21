import React from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "../../queries";

export default function Books() {
  const { loading, error, data: result } = useQuery(ALL_BOOKS);

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

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      updateCacheWith(addedBook);
    },
  });

  if (loading) {
    return (
      <div className="container p-3 text-base md:text-lg lg:text-lg font-bold">
        Loadinggg....
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-3 font-bold text-base md:text-lg lg:text-lg text-red-600">
        Could not fetch books
      </div>
    );
  }

  return (
    <div className="w-full md:w-8/12 mx-auto my-2 md:my-5 p-3">
      <h2 className="text-center font-bold text-lg md:text-4xl my-2 uppercase">
        books
      </h2>

      <table className="w-full text-sm md:text-base text-left md:text-center shadow-xl mb-10 p-2 h-auto overflow-auto border-b-2 border-black">
        <tbody>
          <tr className="p-2">
            <th>Name</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.allBooks.map((book) => (
            <tr key={book.id} className="border-gray-800 border-b-2 p-2">
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
