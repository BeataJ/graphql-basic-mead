import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
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
      return null;
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
