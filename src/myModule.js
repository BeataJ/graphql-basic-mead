// Named export - has a name. Have as many as needed.
// Default export - has no name. You can only have one.
const message = 'Same message from myModule.js';
const name = 'beata';

const location = 'Surrey';

const getGreeting = (name) => {
  return `Welcome to te course ${name}`;
};

export { message, name, getGreeting, location as default };
