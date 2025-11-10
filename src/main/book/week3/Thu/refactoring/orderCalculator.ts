// Before Refactoring: Poor structure with violations of clean code principles

function calculateOrder(items: any, customerType: string) {
  let total = 0;
  let discount = 0;
  let tax = 0;
  let shipping = 0;
  
  // Calculate subtotal
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  
  // Calculate discount - nested if statements and magic numbers
  if (customerType === 'vip') {
    if (total > 1000) {
      discount = total * 0.2;
    } else if (total > 500) {
      discount = total * 0.1;
    } else {
      discount = total * 0.05;
    }
  } else if (customerType === 'regular') {
    if (total > 1000) {
      discount = total * 0.1;
    } else if (total > 500) {
      discount = total * 0.05;
    }
  }
  // new customers get no discount - implicit logic
  
  let afterDiscount = total - discount;
  
  // Calculate tax - magic number
  tax = afterDiscount * 0.1;
  
  // Calculate shipping - magic numbers and conditions
  if (afterDiscount < 100) {
    shipping = 10;
  }
  
  return {
    subtotal: total,
    discount: discount,
    tax: tax,
    shipping: shipping,
    total: afterDiscount + tax + shipping
  };
}

// Usage with poor type safety
const items = [
  { price: 100, quantity: 2 },
  { price: 50, quantity: 3 }
];

const result = calculateOrder(items, 'vip');
console.log(result);