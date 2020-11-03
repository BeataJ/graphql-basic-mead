const Query = {
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
};

export { Query as default };
