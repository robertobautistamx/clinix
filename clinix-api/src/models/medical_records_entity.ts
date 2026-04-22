import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('medical_records')
@Index('idx_patient', ['patient_id'])
@Index('idx_doctor', ['doctor_id'])
@Index('idx_diagnosis', ['diagnosis_id'])
@Index('idx_visit_date', ['visit_date'])
@Index('fk_mr_hospital', ['hospital_id'])

export class MedicalRecordsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  record_id!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  patient_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  doctor_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  hospital_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  diagnosis_id!: number;

  @Column({ type: 'datetime', nullable: false })
  visit_date!: Date;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: 'ej: 120/80' })
  blood_pressure?: string;

  @Column({ type: 'smallint', nullable: true })
  heart_rate?: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature?: number;

  @Column({ type: 'tinyint', nullable: true })
  oxygen_sat?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'date', nullable: true })
  follow_up_date?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;

  // Relaciones con otras entidades pueden agregarse aquí usando @ManyToOne y @JoinColumn
}
