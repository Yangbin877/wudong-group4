import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { RoutePackage } from './route-package.entity';

@Entity('route_itinerary')
export class RouteItinerary {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true })
  routePackageId: number;

  @Column()
  dayNo: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  scenicSpotIds: number[];

  @Column({ length: 255, nullable: true })
  meals: string;

  @Column({ length: 255, nullable: true })
  accommodation: string;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RoutePackage, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'route_package_id' })
  routePackage: RoutePackage;
}
