import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TicketType } from './ticket-type.entity';

@Entity('ticket_inventory')
export class TicketInventory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true })
  ticketTypeId: number;

  @Column({ type: 'date' })
  inventoryDate: Date;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  sold: number;

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
}
