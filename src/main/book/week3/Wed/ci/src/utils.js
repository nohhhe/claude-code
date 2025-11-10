function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

module.exports = {
  add,
  multiply,
  validateEmail,
  formatUser
};