class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }

  static products = [];
  static nextId = 1;

  static create(productData) {
    const product = new Product(
      this.nextId++,
      productData.name,
      productData.price,
      productData.stock
    );
    this.products.push(product);
    return product;
  }

  static findById(id) {
    return this.products.find(product => product.id === id);
  }

  static getAll() {
    return this.products;
  }

  static updateStock(id, quantity) {
    const product = this.findById(id);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
      return true;
    }
    return false;
  }
}

module.exports = Product;