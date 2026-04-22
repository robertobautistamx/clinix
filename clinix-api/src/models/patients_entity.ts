import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity('patients')
@Unique('uq_curp', ['curp'])
@Index('idx_gender', ['gender'])
@Index('idx_insurance', ['insurance_type'])
@Index('idx_birth', ['birth_date'])

export class PatientsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  patient_id!: number;

  @Column({ type: 'varchar', length: 18, nullable: false })
  curp!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  last_name!: string;

  @Column({ type: 'enum', enum: ['M', 'F'], nullable: false })
  gender!: 'M' | 'F';

  @Column({ type: 'date', nullable: false })
  birth_date!: string;

  @Column({ type: 'varchar', length: 4, nullable: false })
  blood_type!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  city!: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  state!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  address!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone!: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  insurance_type!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  insurance_id?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight_kg?: number;

  @Column({ type: 'smallint', nullable: true })
  height_cm?: number;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'tinyint', width: 1, default: () => '0', nullable: false })
  smoker!: boolean;

  @Column({ type: 'tinyint', width: 1, default: () => '0', nullable: false })
  alcohol!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  registered_at!: Date;
}
