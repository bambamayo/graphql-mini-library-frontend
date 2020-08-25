import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      id
      born
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      id
      published
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook($data: CreateNewBookInput!) {
    addBook(data: $data) {
      title
      author
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation authorEdit($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;
