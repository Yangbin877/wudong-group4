import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TicketType } from './ticket-type.entity';
import { RoutePackage } from './route-package.entity';

@Entity('electronic_ticket')
export class ElectronicTicket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  ticketTypeId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  routePackageId: number;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  userId: number;

  @Column({ length: 64, nullable: true })
  orderNo: string;

  @Column({ length: 64, unique: true })
  qrCode: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'date', nullable: true })
  validStart: Date;

  @Column({ type: 'date', nullable: true })
  validEnd: Date;

  @Column({ type: 'datetime', nullable: true })
  usedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TicketType, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @ManyToOne(() => RoutePackage, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'route_package_id' })
  routePackage: RoutePackage;
}
