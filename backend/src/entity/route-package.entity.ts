import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('route_package')
export class RoutePackage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  coverImage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 1 })
  days: number;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
