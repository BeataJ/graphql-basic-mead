import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    
  }
`;

// Resolvers
const resolvers = {
  Query: {},
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up! localhost: 4000');
});
