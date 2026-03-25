import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    lists: [GroceryList!]!
  }

  type GroceryList {
    id: String!
    date: String!
    items: [GroceryItem!]!
  }

  type GroceryItem {
    id: String!
    name: String!
    price: Float!
  }

  type Query {
    getMyLists: [GroceryList!]!
  }

  type Mutation {
    createList: GroceryList!
    addItem(listId: String!, name: String!, price: Float!): GroceryItem!
  }
`;