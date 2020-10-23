import { GraphQLServer } from 'graphql-yoga';

// Type definations (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me: () => {
      return {
        id: '12345',
        name: 'Mike',
        email: 'mail@example.ca',
      };
    },
    post: () => {
      return {
        id: '98765',
        title:
          'Missing couple rescued after frigid night spent in North Shore mountains',
        body:
          'Two overdue hikers have been found alive and well by search and rescue crews after spending a cold and wet night stranded in the North Shore. ',
        published: true,
      };
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
