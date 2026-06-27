import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ScenicSpot } from './scenic-spot.entity';

@Entity('ticket_type')
export class TicketType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true })
  scenicSpotId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 1 })
  validityDays: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ScenicSpot, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'scenic_spot_id' })
  scenicSpot: ScenicSpot;
}
