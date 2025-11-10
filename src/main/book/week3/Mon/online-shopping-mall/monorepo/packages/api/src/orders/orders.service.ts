import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@monorepo/shared';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}