import myCurrentLocation, { message, name, getGreeting } from './myModule';
import myAdd, { subtract } from './math';

console.log(message);
console.log(name);
console.log(myCurrentLocation);
console.log(getGreeting('bob'));
console.log(myAdd(4, 5));
console.log(subtract(5, 4));
