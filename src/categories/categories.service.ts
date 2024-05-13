import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async onModuleInit() {
    await this.categoriesRepository.addCategories();
  }

  getCategories() {
    return this.categoriesRepository.getCategories();
  }

  addCategories() {
    return this.categoriesRepository.addCategories();
  }

  getCategoryByName(name: string) {
    return this.categoriesRepository.getCategoryByName(name);
  }

  addCategory(category: Partial<Category>) {
    return this.categoriesRepository.addCategory(category);
  }

  updateCategory(id: string, category: Partial<Category>) {
    return this.categoriesRepository.updateCategory(id, category);
  }

  deleteCategory(id: string) {
    return this.categoriesRepository.deleteCategory(id);
  }
}
