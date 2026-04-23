import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { PatientsEntity } from './patients_entity';
import { DoctorsEntity } from './doctors_entity';
import { HospitalsEntity } from './hospitals_entity';
import { Icd10DiagnosesEntity } from './icd10_diagnoses_entity';

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

  // Relaciones
  @ManyToOne(() => PatientsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patient_id', foreignKeyConstraintName: 'fk_mr_patient' })
  patient!: PatientsEntity;

  @ManyToOne(() => DoctorsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'doctor_id', foreignKeyConstraintName: 'fk_mr_doctor' })
  doctor!: DoctorsEntity;

  @ManyToOne(() => HospitalsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id', referencedColumnName: 'hospital_id', foreignKeyConstraintName: 'fk_mr_hospital' })
  hospital!: HospitalsEntity;

  @ManyToOne(() => Icd10DiagnosesEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'diagnosis_id', referencedColumnName: 'diagnosis_id', foreignKeyConstraintName: 'fk_mr_diagnosis_mr' })
  diagnosis!: Icd10DiagnosesEntity;
}
