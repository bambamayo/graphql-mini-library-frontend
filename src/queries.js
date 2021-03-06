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
      author {
        name
      }
      id
      published
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook($data: CreateNewBookInput!) {
    addBook(data: $data) {
      title
      id
      published
      author {
        name
      }
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation authorEdit($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        id
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $fullname: String!
    $password: String!
    $favoriteGenre: String!
  ) {
    createUser(
      username: $username
      fullname: $fullname
      password: $password
      favoriteGenre: $favoriteGenre
    ) {
      token
      user {
        username
      }
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      id
      published
    }
  }
`;

export const AUTHOR_EDITED = gql`
  subscription {
    authorEdited {
      name
      bookCount
      id
      born
    }
  }
`;
