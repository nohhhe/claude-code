import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from '@monorepo/shared';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string): CartItem[] {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  addItem(@Param('userId') userId: string, @Body() item: Omit<CartItem, 'id'>): CartItem {
    return this.cartService.addItem(userId, item);
  }

  @Delete(':userId/items/:itemId')
  removeItem(@Param('userId') userId: string, @Param('itemId') itemId: string): void {
    this.cartService.removeItem(userId, itemId);
  }
}