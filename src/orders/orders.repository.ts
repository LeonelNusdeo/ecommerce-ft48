import { ForbiddenException, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './orderdetails.entity';
import { Product } from '../products/products.entity';
import { User } from '../users/users.entity';
import { ProductId } from './orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async addOrder(userId: string, products: ProductId[]) {
    let orderPrice = 0;
  
    const orderUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!orderUser) {
      throw new NotFoundException(`Usuario ID: ${userId} no encontrado.`);
    }

    const uniqueProductsMap = new Map<string, Partial<Product>>();
    products.forEach(product => {
      uniqueProductsMap.set(product.id, product);
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());
    
    const productsWithStock = await Promise.all(
      uniqueProducts.map(async (element) => {
        const product = await this.productsRepository.findOne({
          where: { id: element.id },
        });
        if (!product) {
          throw new NotFoundException(`Producto ID: ${element.id} no encontrado.`);
        }
        return product.stock > 0 ? element : null;
      })
    );
    
    const productsWithStockFiltered = productsWithStock.filter((product) => product !== null);
    if(productsWithStockFiltered.length === 0) {
      throw new PreconditionFailedException(`No hay ningún producto con stock disponible para crear esta orden.`)
    }
    
    const order = new Order();
    order.date = new Date();
    order.user = orderUser;
    const newOrder = await this.ordersRepository.save(order);
    
    const productsArray = await Promise.all(
      productsWithStockFiltered.filter(Boolean).map(async (element) => {
        const product = await this.productsRepository.findOne({
          where: { id: element.id },
        });

        orderPrice += Number(product.price);
        
        await this.productsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );
        return product;
      }),
    );
  
    const orderDetail = new OrderDetail();
    orderDetail.price = Number(Number(orderPrice).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;
    await this.orderDetailsRepository.save(orderDetail);
  
    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderdetail: true },
    });
  }
  

  async getOrder(orderId: string, requestedUserId: string) {
    const requestingUser = await this.usersRepository.findOne({
      where: { id: requestedUserId },
    });
    const foundOrderWithUser = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: { user: true, orderdetail: { products: true } },
    });
    if (!foundOrderWithUser) {
      throw new NotFoundException(`Orden ID: ${orderId} no encontrada.)`);
    }
    if ((foundOrderWithUser.user.id === requestingUser.id) || (requestingUser.isAdmin)) {
      const foundOrder = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: { orderdetail: { products: true } },
      });
      return foundOrder;
    } else {
      throw new ForbiddenException('No tiene permisos para acceder a esta orden.');
    }
  }
}
