import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn } from "typeorm";
import { Category } from "../categories/categories.entity";
import { OrderDetail } from "../orders/orderdetails.entity";

@Entity({
	name: "products"
})
export class Product {
	/**
   * El id del producto (UUID v4)
   * @example "75b4566f-ddc3-4b7c-93de-4f4d5840cc34"
   */
	@PrimaryGeneratedColumn("uuid")
	id: string;

	/**
   * El nombre del producto (único)
   * @example "Iphone 15"
   */
	@Column({
        type: "varchar",
		length: 50,
		unique: true
	})
	name: string;

	/**
   * La descripción del producto
   * @example "The best smartphone in the world"
   */
    @Column({
        type: "text",
	})
	description: string;

	/**
   * El precio del producto
   * @example 199.99
   */
    @Column({
		type: "decimal",
        precision: 10,
        scale: 2
	})
	price: number;

	/**
   * El stock del producto
   * @example 12
   */
    @Column({
		type: "integer"
	})
	stock: number;

	/**
   * El link a la imagen del producto
   * @example "https://res.cloudinary.com/deqta8mjr/image/upload/v1714718709/va94ywktwdapo2i6hmbx.png"
   */
    @Column({
        type: "text",
        default: "https://cdn-icons-png.freepik.com/512/679/679922.png"
	})
	imgUrl: string;

	/**
   * La Categoria del producto
   * 
   */
	@ManyToOne(() => Category, (category) => category.products)
	@JoinColumn({ name: 'category_id'})
    category: Category;

    @ManyToMany(() => OrderDetail, (orderdetail) => orderdetail.products)
    orderdetails: OrderDetail[]
};