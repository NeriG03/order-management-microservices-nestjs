import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StatusOrder } from '../enums/status-order.enum';
import { DetailsOrder } from 'src/details-order/entities/details-order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'enum', enum: StatusOrder, default: StatusOrder.PENDING })
  status: StatusOrder;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => DetailsOrder, details => details.order, { cascade: true })
  details: DetailsOrder[];
}
