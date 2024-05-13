import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/users.entity";
import { OrderDetail } from "./orderdetails.entity";

@Entity({
	name: "orders"
})
export class Order {
    /**
   * El id de la orden (UUID v4)
   * @example "7802c75b-649b-43cc-a7f5-4d0919a5b002"
   */
	@PrimaryGeneratedColumn("uuid")
	id: string;

    /**
   * La fecha de la orden (UUID v4)
   * @example "2024-05-13"
   */
    @Column({
        type: "date"
    })
    date: Date

    /**
   * El orderDetail de la orden
   * 
   */
    @OneToOne(() => OrderDetail, (orderdetail) => orderdetail.order)
    orderdetail: OrderDetail;

    /**
   * El usuario que generó la orden
   * 
   */
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;
};