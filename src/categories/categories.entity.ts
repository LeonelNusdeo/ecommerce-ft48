import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/products.entity';

@Entity({
  name: 'categories',
})
export class Category {
  /**
   * El id de la categoría (UUID v4)
   * @example "1f3e51bb-a9aa-4b97-ba9c-dabf1dd7d321"
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * El nombre de la categoría (único)
   * @example "mouse"
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products: Product[];
}
