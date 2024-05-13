import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Product } from '../products/products.entity';
import { ProductId } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  addOrder(userId: string, products: ProductId[]) {
    return this.ordersRepository.addOrder(userId, products);
  }

  getOrder(id: string, reqUserId: string) {
    return this.ordersRepository.getOrder(id, reqUserId);
  }
}
