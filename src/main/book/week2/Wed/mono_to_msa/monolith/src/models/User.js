class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }

  static users = [];
  static nextId = 1;

  static create(userData) {
    const user = new User(
      this.nextId++,
      userData.email,
      userData.password,
      userData.name
    );
    this.users.push(user);
    return user;
  }

  static findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  static findById(id) {
    return this.users.find(user => user.id === id);
  }

  static getAll() {
    return this.users;
  }
}

module.exports = User;