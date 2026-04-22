import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('transaction_details')
@Index('transaction_id', ['transaction_id'])
@Index('product_id', ['product_id'])

export class TransactionDetailsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  detail_id!: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  transaction_id?: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  product_id?: number;

  @Column({ type: 'smallint', nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal?: number;

  // Relaciones con entidades Transactions y Products pueden agregarse aquí usando @ManyToOne y @JoinColumn
}
