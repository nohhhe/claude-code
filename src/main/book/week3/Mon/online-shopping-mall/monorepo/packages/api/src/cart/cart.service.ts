import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItem } from '@monorepo/shared';

@Injectable()
export class CartService {
  private carts: Map<string, CartItem[]> = new Map();

  getCart(userId: string): CartItem[] {
    return this.carts.get(userId) || [];
  }

  addItem(userId: string, item: Omit<CartItem, 'id'>): CartItem {
    const cart = this.getCart(userId);
    const newItem: CartItem = {
      id: Date.now().toString(),
      ...item,
    };
    
    const updatedCart = [...cart, newItem];
    this.carts.set(userId, updatedCart);
    
    return newItem;
  }

  removeItem(userId: string, itemId: string): void {
    const cart = this.getCart(userId);
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }
    
    cart.splice(itemIndex, 1);
    this.carts.set(userId, cart);
  }
}