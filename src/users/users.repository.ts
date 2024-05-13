import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.usersRepository.find({ skip, take: limit });

    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async getUser(id: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { id: id },
      relations: { orders: true },
    });
    if (!foundUser) {
      throw new NotFoundException(`Usuario ID: ${id} no encontrado.`);
    }
    const { password, isAdmin, ...foundUserNoPassword } = foundUser;
    return foundUserNoPassword;
  }

  async addUser(user: Partial<User>) {
    const newUser = await this.usersRepository.save(user);

    const createdUser = await this.usersRepository.findOne({
      where: { id: newUser.id },
    });
    const { password, isAdmin, ...createdUserNoPassword } = createdUser;
    return createdUserNoPassword;
  }

  async updateUser(id: string, user: Partial<User>) {
    const userToUpdate = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!userToUpdate) {
      throw new NotFoundException(`Usuario ID: ${id} no encontrado.`);
    }
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne({
      where: { id: id },
    });
    const { password, isAdmin, ...updatedUserNoPassword } = updatedUser;
    return updatedUserNoPassword;
  }

  async deleteUser(userIdToDelete: string, requestedUserId: string) {
    const requestingUser = await this.usersRepository.findOne({
      where: { id: requestedUserId },
    });
    const userToDelete = await this.usersRepository.findOne({
      where: { id: userIdToDelete },
      relations: { orders: true },
    });
    if (!userToDelete) {
      throw new NotFoundException(`Usuario ID: ${userIdToDelete} no encontrado.`);
    }
    if (userToDelete.orders.length !== 0) {
      throw new ForbiddenException(`Usuario ID: ${userIdToDelete} tiene ordenes asociadas. No puede ser eliminado.`);
    }
    if (
      (requestingUser === userToDelete) || (requestingUser.isAdmin && !userToDelete.isAdmin) 
    ) {
      await this.usersRepository.remove(userToDelete);
      const { password, isAdmin, ...deletedUserNoPassword } = userToDelete;
      return deletedUserNoPassword;
    }
    throw new ForbiddenException('No tiene permisos para eliminar este usuario.');
  }

  async getUserByEmail(email: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { email: email },
    });
    return foundUser;
  }
}
