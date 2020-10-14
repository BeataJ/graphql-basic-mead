import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => {
      return 'This is my first query';
    },
    name: () => {
      return 'Bob Jasinski';
    },
    location: () => {
      return 'Surray, BC';
    },
    bio: () => {
      return " I'm human";
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
});
