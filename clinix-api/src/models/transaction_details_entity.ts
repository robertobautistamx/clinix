import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionsEntity } from './transactions_entity';
import { ProductsEntity } from './products_entity';

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

  @ManyToOne(() => TransactionsEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'transaction_id', foreignKeyConstraintName: 'fk_detail_transaction' })
  transaction!: TransactionsEntity;

  @ManyToOne(() => ProductsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'product_id', foreignKeyConstraintName: 'fk_detail_product' })
  product!: ProductsEntity;
}
