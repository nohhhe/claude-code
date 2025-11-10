import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    // Temporarily disabled microservices
    // ClientsModule.register([
    //   {
    //     name: 'PAYMENT_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
    //       queue: 'payment_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    //   {
    //     name: 'NOTIFICATION_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
    //       queue: 'notification_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}