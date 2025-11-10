function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function subtract(a, b) {
  return a - b;
}

function power(base, exponent) {
  if (exponent === 0) return 1;
  let result = 1;
  for (let i = 0; i < Math.abs(exponent); i++) {
    result *= base;
  }
  return exponent < 0 ? 1 / result : result;
}

module.exports = {
  add,
  multiply,
  divide,
  subtract,
  power
};