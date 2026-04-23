import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity('products')
@Unique('uq_sku', ['sku'])
@Index('idx_category', ['category'])
@Index('idx_laboratory', ['laboratory'])

export class ProductsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  product_id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  sku!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  category!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  laboratory!: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  presentation!: string;

  @Column({ type: 'char', length: 3, nullable: false, default: () => "'MXN'" })
  currency!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  cost_price!: number;

  @Column({ type: 'enum', enum: ['RX', 'OTC'], default:'RX', nullable: false })
  requires_rx!: 'RX' | 'OTC';

  @Column({ type: 'int', default: () => '0', nullable: false })
  stock_units!: number;

  @Column({ type: 'tinyint', width: 1, default: () => '1', nullable: false })
  active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;
}
