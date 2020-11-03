import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Scalar types - String, Boolean, Int, Float

// Demo user data
let users = [
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

let posts = [
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

let comments = [
  {
    id: '10',
    text:
      'However, parents on a budget have long found ways to torment their children by circumventing societal norms and piecing together Halloween costumes themselves.Such was the case in 1995, when a Midday correspondent demonstrated ',
    author: '1',
    post: '1',
  },
  {
    id: '11',
    text:
      'But why limit the discussion to costumes when so much of Halloween is about the celebrations?  ',
    author: '3',
    post: '3',
  },
  {
    id: '12',
    text:
      'In the segment, party planner Barbara Kirschenblatt also suggests some spooky party games to entertain teens. ',
    author: '3',
    post: '2',
  },
  {
    id: '13',
    text:
      'In the segment, party planner Barbara Kirschenblatt also suggests some spooky party games to entertain teens. ',
    author: '2',
    post: '1',
  },
];

// Type definations (schema)
const typeDefs = `
  type Query {
    users(query:String): [User!]!
    posts(query:String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!):User!
    deleteUser(id: ID!):User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!):Post!
    createComment(data: CreateCommentInput!):Comment!
    deleteComment(id: ID!):Comment!
  }

  input CreateUserInput {
    name: String!,
    email: String!,
    age: Int
  }

  input CreatePostInput {
    title: String!, 
    body: String!, 
    published: Boolean!, 
    author: ID!
  }

  input CreateCommentInput {
    text:String!, 
    author: ID!, 
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments: (parent, args, ctx, info) => {
      return comments;
    },
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email Taken');
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);
      return user;
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not find');
      }

      const deleteUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deleteUsers[0];
    },
    createPost: (parent, args, ctx, info) => {
      const userExist = users.some((user) => user.id === args.data.author);

      if (!userExist) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    deletePost: (parent, args, ctx, info) => {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment: (parent, args, ctx, info) => {
      const userExist = users.some((user) => user.id === args.data.author);
      const postExistPublish = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExist || !postExistPublish) {
        throw new Error('User not exist or post not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => {
        return post.id === parent.post;
      });
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
