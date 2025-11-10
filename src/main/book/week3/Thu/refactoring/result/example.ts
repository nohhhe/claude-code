// Usage example for the AFTER version (clean structure)
import { OrderCalculator, Order } from './orderCalculator';

// Strong typing ensures data integrity
const order: Order = {
  items: [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 3 }
  ],
  customer: { type: 'vip' }
};

// Type-safe calculation
const vipSummary = OrderCalculator.calculate(order);
console.log('VIP Order Summary:', vipSummary);

// Different customer types with type safety
const regularOrder: Order = {
  items: [
    { price: 75, quantity: 1 },
    { price: 25, quantity: 4 }
  ],
  customer: { type: 'regular' }
};

const regularSummary = OrderCalculator.calculate(regularOrder);
console.log('Regular Order Summary:', regularSummary);

const newOrder: Order = {
  items: [
    { price: 200, quantity: 1 }
  ],
  customer: { type: 'new' }
};

const newSummary = OrderCalculator.calculate(newOrder);
console.log('New Customer Order Summary:', newSummary);

// TypeScript will catch errors at compile time:
// const badOrder: Order = {
//   items: [{ cost: 100, qty: 2 }], // ❌ Compile error!
//   customer: { type: 'viip' }      // ❌ Compile error!
// };