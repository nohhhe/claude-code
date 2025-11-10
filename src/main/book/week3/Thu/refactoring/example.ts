// Usage example for the BEFORE version (poor structure)
import { calculateOrder } from './orderCalculator';

// Weak typing - items could be anything
const items = [
  { price: 100, quantity: 2 },
  { price: 50, quantity: 3 }
];

// String-based customer type - error prone
const result1 = calculateOrder(items, 'vip');
console.log('VIP Order:', result1);

const result2 = calculateOrder(items, 'regular');
console.log('Regular Order:', result2);

// Potential runtime errors - typos not caught at compile time
const result3 = calculateOrder(items, 'viip'); // typo!
console.log('Typo Order:', result3);

// No type safety - could pass wrong data structure
const badItems = [{ cost: 100, qty: 2 }]; // wrong property names
const result4 = calculateOrder(badItems, 'vip');
console.log('Bad Structure Order:', result4);