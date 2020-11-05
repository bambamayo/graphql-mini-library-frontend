import React from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../../queries";

export default function Books() {
  const { loading, error, data: result } = useQuery(ALL_BOOKS);

  if (loading) {
    return <div>Loadinggg</div>;
  }

  if (error) {
    return <div>Could not fetch books</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>s/n</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.allBooks.map((book) => (
            <tr key={book.id}>
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
