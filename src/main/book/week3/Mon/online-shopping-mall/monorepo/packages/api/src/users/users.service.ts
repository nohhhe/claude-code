import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@monorepo/shared';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'user@example.com',
      name: '홍길동',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}