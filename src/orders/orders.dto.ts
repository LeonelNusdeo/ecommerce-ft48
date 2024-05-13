import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Product } from '../products/products.entity';
import { Type } from 'class-transformer';

export class ProductId {
  /**
   * El objeto ProductId (debe contener el id (UUID v4) de un producto a comprar)
   * @example "{ "id": "UUID producto" }"
   */
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class CreateOrderDto {
  /**
   * El id del usuario (UUID v4) que realiza la compra
   * @example "4f84ed85-1373-4fe3-93d5-5a555f89745b"
   */
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  /**
   * El array de ProductId (debe contener al menos un ProductId)
   * @example "[{ "id": "UUID producto 1" }, { "id": "UUID producto 2" }]"
   */
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductId)
  products: ProductId[];
}
