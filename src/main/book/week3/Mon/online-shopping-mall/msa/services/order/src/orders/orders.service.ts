import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    // @Inject('PAYMENT_SERVICE')
    // private paymentClient: ClientProxy,
    // @Inject('NOTIFICATION_SERVICE')
    // private notificationClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, shippingAddress, billingAddress, userId, notes } = createOrderDto;

    // Calculate totals
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const subtotal = item.price * item.quantity;
      totalAmount += subtotal;

      const orderItem = this.orderItemRepository.create({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal,
      });
      orderItems.push(orderItem);
    }

    // Create order - prepare data with proper optional types
    const orderData: Partial<Order> = {
      userId,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items: orderItems,
      status: OrderStatus.PENDING,
    };
    
    if (notes) {
      orderData.notes = notes;
    }
    
    const order = this.orderRepository.create(orderData);

    const savedOrder: Order = await this.orderRepository.save(order);

    // Temporarily disabled microservices events
    // this.paymentClient.emit('order_created', {
    //   orderId: savedOrder.id,
    //   userId,
    //   amount: totalAmount,
    // });

    // this.notificationClient.emit('order_notification', {
    //   userId,
    //   type: 'order_created',
    //   orderId: savedOrder.id,
    //   message: `Order ${savedOrder.id} has been created successfully`,
    // });

    return savedOrder;
  }

  async findAll(userId?: string): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items');

    if (userId) {
      query.where('order.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.id = :id', { id });

    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    const order = await query.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    const updatedOrder = await this.orderRepository.save({
      ...order,
      ...updateOrderDto,
    });

    // Temporarily disabled status change events
    // if (updateOrderDto.status) {
    //   this.notificationClient.emit('order_status_changed', {
    //     orderId: id,
    //     userId: order.userId,
    //     status: updateOrderDto.status,
    //     message: `Order ${id} status changed to ${updateOrderDto.status}`,
    //   });
    // }

    return updatedOrder;
  }

  async cancel(id: string, userId?: string): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel shipped or delivered order');
    }

    return this.update(id, { status: OrderStatus.CANCELLED });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['items'],
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.findAll(userId);
  }
}