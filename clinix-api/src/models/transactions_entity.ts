import { Entity, PrimaryGeneratedColumn, Column, Index, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { PatientsEntity } from './patients_entity';
import { DoctorsEntity } from './doctors_entity';
import { HospitalsEntity } from './hospitals_entity';
import { ProductsEntity } from './products_entity';
import { Icd10DiagnosesEntity } from './icd10_diagnoses_entity';

@Entity('transactions')
@Unique('uq_tx_code', ['transaction_code'])
@Index('idx_patient', ['patient_id'])
@Index('idx_doctor', ['doctor_id'])
@Index('idx_hospital', ['hospital_id'])
@Index('idx_product', ['product_id'])
@Index('idx_diagnosis', ['diagnosis_id'])
@Index('idx_date', ['transaction_date'])
@Index('idx_status', ['status'])
@Index('idx_type', ['transaction_type'])

export class TransactionsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  transaction_id!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  transaction_code!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  patient_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  doctor_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  hospital_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  product_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  diagnosis_id!: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  transaction_type!: string;

  @Column({ type: 'smallint', default: () => '1', nullable: false })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: () => '0.00', nullable: false })
  discount_pct!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: () => '0.00', nullable: false })
  discount_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: () => '16.00', nullable: false })
  tax_pct!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  tax_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_amount!: number;

  @Column({ type: 'char', length: 3, default: () => "'MXN'", nullable: false })
  currency!: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  payment_method!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: () => '0.00', nullable: false })
  insurance_covered!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  patient_paid!: number;

  @Column({ type: 'varchar', length: 20, default: () => "'COMPLETADA'", nullable: false })
  status!: string;

  @Column({ type: 'datetime', nullable: false })
  transaction_date!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;

  @ManyToOne(() => PatientsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patient_id', foreignKeyConstraintName: 'fk_tx_patient' })
  patient!: PatientsEntity;

  @ManyToOne(() => DoctorsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'doctor_id', foreignKeyConstraintName: 'fk_tx_doctor' })
  doctor!: DoctorsEntity;

  @ManyToOne(() => HospitalsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id', referencedColumnName: 'hospital_id', foreignKeyConstraintName: 'fk_tx_hospital' })
  hospital!: HospitalsEntity;

  @ManyToOne(() => ProductsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'product_id', foreignKeyConstraintName: 'fk_tx_product' })
  product!: ProductsEntity;

  @ManyToOne(() => Icd10DiagnosesEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'diagnosis_id', referencedColumnName: 'diagnosis_id', foreignKeyConstraintName: 'fk_tx_diagnosis_tx' })
  diagnosis!: Icd10DiagnosesEntity;
}
