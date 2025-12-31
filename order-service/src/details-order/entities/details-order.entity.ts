import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('details_order')
export class DetailsOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price' })
  unitPrice: number;

  @Column()
  subtotal: number;

  @ManyToOne(() => Order, order => order.details)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
