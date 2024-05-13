import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { In, Not, Repository } from 'typeorm';
import * as data from '../utils/data.json';
import { OrderDetail } from '../orders/orderdetails.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getCategories() {
    return await this.categoriesRepository.find();
  }

  async getCategoryByName(name: string) {
    const foundCategory = await this.categoriesRepository.findOne({
      where: { name: name },
    });
    if (!foundCategory) {
      throw new NotFoundException(`Categoría NOMBRE: ${name} no encontrada.`);
    }
    return foundCategory;
  }

  async addCategories() {
    await Promise.all(
      data?.map(async (item) => {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values({ name: item.category })
          .orIgnore()
          .execute();
      }),
    );

    return 'Categorías precargadas.';
  }

  async addCategory(category: Partial<Category>) {
    const foundCategory = await this.categoriesRepository.findOne({
      where: { name: category.name },
    });
    if (foundCategory) {
      throw new BadRequestException(
        `Categoría NOMBRE: ${category.name} ya existe.`,
      );
    }
    const newCategory = await this.categoriesRepository.save(category);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<Category>) {
    const categoryToUpdate = await this.categoriesRepository.findOne({
      where: { id: id },
    });
    if (!categoryToUpdate) {
      throw new NotFoundException(`Categoría ID: ${id} no encontrada.`);
    }
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id: id },
    });
    return updatedCategory;
  }

  async deleteCategory(id: string) {
    const categoryToDelete = await this.categoriesRepository.findOne({
      where: { id: id },
      relations: { products: true },
    });
    if (!categoryToDelete) {
      throw new NotFoundException(`Categoría ID: ${id} no encontrada.`);
    }
    if (categoryToDelete.products.length !== 0) {
      throw new ForbiddenException(
        `Categoría ID: ${id} tiene productos asociados. No puede ser eliminada.`,
      );
    }
    this.categoriesRepository.remove(categoryToDelete);
    return categoryToDelete;
  }
}
