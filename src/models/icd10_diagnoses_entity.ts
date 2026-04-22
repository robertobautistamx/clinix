import { Column, Entity, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('icd10_diagnoses')
@Unique('uq_icd10_code', ['icd10_code'])
@Index('idx_category', ['category_code'])

export class Icd10DiagnosesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  diagnosis_id!: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  icd10_code!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  category_code!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  category_name!: string;

  @Column({ type: 'enum', enum: ['LEVE', 'MODERADA', 'GRAVE', 'CRITICA'], nullable: false })
  severity!: 'LEVE' | 'MODERADA' | 'GRAVE' | 'CRITICA';

  @Column({ type: 'tinyint', width: 1, default: () => '0', nullable: false })
  chronic!: boolean;

  @Column({ type: 'tinyint', width: 1, default: () => '0', nullable: false })
  contagious!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;
}