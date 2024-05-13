import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto ID: ${productId} no encontrado.`);
    }
    const response = await this.filesRepository.uploadImage(file);
    await this.productRepository.update(productId, { imgUrl: response.secure_url });
    const updatedProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    return updatedProduct;
  }
}
