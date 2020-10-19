import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title: () => {
      return 'My first release Book';
    },
    price: () => {
      return 12.45;
    },
    releaseYear: () => {
      return 2020;
    },
    rating: () => {
      return 8;
    },
    inStock: () => {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up! localhost: 4000');
});
