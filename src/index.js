import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

// Resolvers
const resolvers = {
  Query: {
    users: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.users;
      }

      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.posts;
      }

      return db.posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments;
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
  Mutation: {
    createUser: (parent, args, { db }, info) => {
      const emailTaken = db.users.some(
        (user) => user.email === args.data.email
      );

      if (emailTaken) {
        throw new Error('Email Taken');
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      db.users.push(user);
      return user;
    },
    deleteUser: (parent, args, { db }, info) => {
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not find');
      }

      const deleteUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.post !== post.id
          );
        }

        return !match;
      });

      db.comments = db.comments.filter((comment) => comment.author !== args.id);

      return deleteUsers[0];
    },
    createPost: (parent, args, { db }, info) => {
      const userExist = db.users.some((user) => user.id === args.data.author);

      if (!userExist) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      db.posts.push(post);

      return post;
    },
    deletePost: (parent, args, { db }, info) => {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = db.posts.splice(postIndex, 1);

      db.comments = db.comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment: (parent, args, { db }, info) => {
      const userExist = db.users.some((user) => user.id === args.data.author);
      const postExistPublish = db.posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExist || !postExistPublish) {
        throw new Error('User not exist or post not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      db.comments.push(comment);

      return comment;
    },
    deleteComment: (parent, args, { db }, info) => {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deleteComment = db.comments.splice(commentIndex, 1);

      return deleteComment[0];
    },
  },
  Post: {
    author: (parent, args, { db }, info) => {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts: (parent, args, { db }, info) => {
      return db.posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author: (parent, args, { db }, info) => {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    post: (parent, args, { db }, info) => {
      return db.posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
});

server.start(() => {
  console.log('The server is up! localhost: 4000');
});
