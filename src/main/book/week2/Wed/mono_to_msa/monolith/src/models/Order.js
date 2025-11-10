class Order {
  constructor(id, userId, items, totalAmount) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  static orders = [];
  static nextId = 1;

  static create(orderData) {
    const order = new Order(
      this.nextId++,
      orderData.userId,
      orderData.items,
      orderData.totalAmount
    );
    this.orders.push(order);
    return order;
  }

  static findById(id) {
    return this.orders.find(order => order.id === id);
  }

  static findByUserId(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  static updateStatus(id, status) {
    const order = this.findById(id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }

  static getAll() {
    return this.orders;
  }
}

module.exports = Order;