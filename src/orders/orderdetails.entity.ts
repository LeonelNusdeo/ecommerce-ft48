import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Order } from "../orders/orders.entity";
import { Product } from "../products/products.entity";

@Entity({
	name: "orderdetails"
})
export class OrderDetail {
	/**
   * El id del order detail (UUID v4)
   * @example "614f9764-418b-4d3b-bde9-295bb9d6f55f"
   */
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/**
   * La sumatoria del precio de todos los productos del order detail (maximo 8 digitos y 2 decimales, separados por un . )
   * @example "199.99"
   */
    @Column({
		type: "decimal",
        precision: 10,
        scale: 2
	})
	price: number;

	/**
   * La orden del orderDetail
   * 
   */
    @OneToOne(() => Order, (order) => order.orderdetail)
	@JoinColumn({ name: "order_id" })
	order: Order

	/**
   * Los productos de la orderDetail
   * 
   */
    @ManyToMany(() => Product, (product) => product.orderdetails)
    @JoinTable({
		name: "orderdetails_products",
		joinColumn: {
			name: 'product_id',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'orderdetail_id',
			referencedColumnName: 'id'
		}
	})
    products: Product[]
};