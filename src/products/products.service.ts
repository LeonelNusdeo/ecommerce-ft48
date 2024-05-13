import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async onModuleInit() {
    await this.productsRepository.addProducts();
  }

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  getProduct(id: string) {
    return this.productsRepository.getProduct(id);
  }

  addProducts() {
    return this.productsRepository.addProducts();
  }
  
  updateProduct(id: string, product: Partial<Product>) {
    return this.productsRepository.updateProduct(id, product);
  }
  
  addProduct(product: Partial<Product>) {
    return this.productsRepository.addProduct(product);
  }

  deteleProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }
}
