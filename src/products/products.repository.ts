import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { In, Not, Repository } from 'typeorm';
import { Category } from '../categories/categories.entity';
import * as data from '../utils/data.json';
import { OrderDetail } from '../orders/orderdetails.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    const skip = (page - 1) * limit;

    return await this.productsRepository.find({
      relations: {
        category: true,
      },
      skip,
      take: limit,
    });
  }

  async getProduct(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException(`Producto ID: ${id} no encontrado.`);
    }
    return product;
  }

  async addProducts() {
    const orderDetailsCount = await this.orderDetailsRepository.count();

    let productsToNotDelete: string[] = [];
    if (orderDetailsCount > 0) {
      const productsInOrderDetails = await this.orderDetailsRepository
        .createQueryBuilder('orderDetail')
        .select('DISTINCT product.id', 'productId')
        .innerJoin('orderDetail.products', 'product')
        .getRawMany();

      productsToNotDelete = productsInOrderDetails.map(
        (product) => product.productId,
      );
    }

    await this.productsRepository.delete({ id: Not(In(productsToNotDelete)) });

    const categories = await this.categoriesRepository.find();

    await Promise.all(
      data?.map(async (item) => {
        const category = categories.find(
          (category) => category.name === item.category,
        );

        const newProduct = new Product();
        newProduct.name = item.name;
        newProduct.description = item.description;
        newProduct.price = item.price;
        newProduct.stock = item.stock;
        newProduct.imgUrl = item.imgUrl;
        newProduct.category = category;

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(newProduct)
          .orUpdate(['description', 'price', 'stock', 'imgUrl'], ['name'])
          .execute();
      }),
    );

    return 'Productos precargados.';
  }

  async updateProduct(id: string, product: Partial<Product>) {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id: id },
      relations: { category: true },
    });

    if (!productToUpdate) {
      throw new NotFoundException(`Producto ID: ${id} no encontrado.`);
    }

    if (product.category) {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id: product.category as unknown as string },
      });

      if (!foundCategory) {
        throw new NotFoundException(
          `Categoria ID: ${product.category} no encontrada.`,
        );
      }
    }

    if (product.name && product.name !== productToUpdate.name) {
      const orderDetailsCount = await this.orderDetailsRepository.count();
      if (orderDetailsCount > 0) {
        const productsInOrderDetails = await this.orderDetailsRepository
          .createQueryBuilder('orderDetail')
          .select('DISTINCT product.id', 'productId')
          .innerJoin('orderDetail.products', 'product')
          .where('product.id = :id', { id: id })
          .getRawMany();

        if (productsInOrderDetails.length > 0) {
          throw new ConflictException(
            `El nombre del producto no puede ser cambiado por estar asociado a una o más órdenes.`,
          );
        }
      }
    }

    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOne({
      where: { id: id },
      relations: { category: true }
    });
    return updatedProduct;
  }

  async addProduct(product: Partial<Product>) {
    const foundCategory = await this.categoriesRepository.findOne({
      where: { id: product.category as unknown as string },
    });
    if (!foundCategory) {
      throw new NotFoundException(
        `Categoria ID: ${product.category} no encontrada.`,
      );
    }

    const newProduct = await this.productsRepository.save(product);
    return newProduct;
  }

  async deleteProduct(id: string) {
    const productToDelete = await this.productsRepository.findOne({
      where: { id: id },
      relations: { orderdetails: true },
    });
    if (!productToDelete) {
      throw new NotFoundException(`Producto ID: ${id} no encontrado.`);
    }
    if (productToDelete.orderdetails.length !== 0) {
      throw new ForbiddenException(
        `Producto ID: ${id} tiene ordenes asociadas. No puede ser eliminado.`,
      );
    }
    this.productsRepository.remove(productToDelete);
    return productToDelete;
  }
}
