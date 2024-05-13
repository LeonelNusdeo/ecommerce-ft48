import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from '../orders/orders.entity';

@Entity({
  name: 'users',
})
export class User {
  /**
   * El id del usuario (UUID v4)
   * @example "7802c75b-649b-43cc-a7f5-4d0919a5b002"
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * El nombre del usuario
   * @example "Ana Perez"
   */
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  /**
   * El email del usuario (único)
   * @example "ana@mail.com"
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  email: string;

  /**
   * La contraseña del usuario (encriptada por bcrypt)
   * @example "$2b$10$93zqA2r9SEFYP6FO2p5XS.5xWijXZ/sT80xDhZMpbILHLYHxV3z3S"
   */
  @Column({
    type: 'varchar',
    length: 72,
  })
  password: string;

  /**
   * El teléfono del usuario
   * @example 45551234
   */
  @Column({
    type: 'integer',
    nullable: true,
  })
  phone: number;

  /**
   * El domicilio del usuario
   * @example "Calle Falsa, 123"
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  /**
   * La ciudad de residencia del usuario
   * @example "Capital Federal"
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  city: string;

  /**
   * El país de residencia del usuario
   * @example "Argentina"
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  country: string;

  /**
   * El estado de Administrador del usuario
   * @example false
   */
  @Column({
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders: Order[];
}
