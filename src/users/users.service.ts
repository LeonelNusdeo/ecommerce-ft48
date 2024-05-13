import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsers(page: number, limit: number) {
    return this.usersRepository.getUsers(page, limit);
  }

  getUser(id: string) {
    return this.usersRepository.getUser(id);
  }

  updateUser(id: string, user: Partial<User>) {
    return this.usersRepository.updateUser(id, user);
  }

  deteleUser(id: string, reqUserId: string) {
    return this.usersRepository.deleteUser(id, reqUserId);
  }
}
