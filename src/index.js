import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean
    gpa: Flat
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
