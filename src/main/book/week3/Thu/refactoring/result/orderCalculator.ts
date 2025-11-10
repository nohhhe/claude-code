// After Refactoring: Clean, maintainable code with SOLID principles

interface OrderItem {
  price: number;
  quantity: number;
}

interface Customer {
  type: 'vip' | 'regular' | 'new';
}

interface Order {
  items: OrderItem[];
  customer: Customer;
}

interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

class OrderCalculator {
  private static readonly TAX_RATE = 0.1;
  private static readonly FREE_SHIPPING_THRESHOLD = 100;
  private static readonly SHIPPING_FEE = 10;
  private static readonly DISCOUNT_RULES = {
    vip: [
      { threshold: 1000, rate: 0.2 },
      { threshold: 500, rate: 0.1 },
      { threshold: 0, rate: 0.05 }
    ],
    regular: [
      { threshold: 1000, rate: 0.1 },
      { threshold: 500, rate: 0.05 },
      { threshold: 0, rate: 0 }
    ],
    new: [
      { threshold: 0, rate: 0 }
    ]
  };

  static calculate(order: Order): OrderSummary {
    const subtotal = this.calculateSubtotal(order.items);
    const discount = this.calculateDiscount(subtotal, order.customer.type);
    const afterDiscount = subtotal - discount;
    const tax = this.calculateTax(afterDiscount);
    const shipping = this.calculateShipping(afterDiscount);

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total: afterDiscount + tax + shipping
    };
  }

  private static calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private static calculateDiscount(amount: number, customerType: Customer['type']): number {
    const rules = this.DISCOUNT_RULES[customerType];
    const applicableRule = rules.find(rule => amount >= rule.threshold);
    return applicableRule ? amount * applicableRule.rate : 0;
  }

  private static calculateTax(amount: number): number {
    return amount * this.TAX_RATE;
  }

  private static calculateShipping(amount: number): number {
    return amount < this.FREE_SHIPPING_THRESHOLD ? this.SHIPPING_FEE : 0;
  }
}