import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float

// Demo user data
const users = [
  {
    id: '1',
    name: 'Beata',
    email: 'beata@example.com',
    age: 30,
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
  },
  {
    id: '3',
    name: 'Emy',
    email: 'emy@example.com',
    age: 50,
  },
];

const posts = [
  {
    id: '1',
    title: 'First Post',
    body:
      'One person has been arrested for arson after a large fire destroyed a building in Vancouver Mount Pleasant neighbourhood on Thursday, the blaze leaving at least one family out of a home and several businesses damaged.',
    published: true,
    author: '2',
  },
  {
    id: '2',
    title: 'Second Post',
    body:
      'One person has been arrested for arson after a large fire destroyed a building in Vancouver Mount Pleasant neighbourhood on Thursday, the blaze leaving at least one family out of a home and several businesses damaged.',
    published: true,
    author: '3',
  },
  {
    id: '3',
    title: 'Third Post',
    body:
      'One person has been arrested for arson after a large fire destroyed a building in Vancouver Mount Pleasant neighbourhood on Thursday, the blaze leaving at least one family out of a home and several businesses damaged.',
    published: false,
    author: '1',
  },
];

// Type definations (schema)
const typeDefs = `
  type Query {
    users(query:String): [User!]!
    posts(query:String): [Post!]!
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
    author: User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
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
