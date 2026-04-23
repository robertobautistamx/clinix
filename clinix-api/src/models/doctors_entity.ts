import { Entity, PrimaryGeneratedColumn, Column, Index, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { HospitalsEntity } from './hospitals_entity';

@Entity('doctors')
@Unique('uq_cedula', ['cedula'])
@Index('idx_specialty', ['specialty'])
@Index('idx_hospital', ['hospital_id'])

export class DoctorsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  doctor_id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  cedula!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  last_name!: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  specialty!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  hospital_id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone!: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  email!: string;

  @Column({ type: 'tinyint', nullable: false })
  years_exp!: number;

  @Column({ type: 'tinyint', width: 1, default: () => '1', nullable: false })
  active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;

  @ManyToOne(() => HospitalsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id', referencedColumnName: 'hospital_id', foreignKeyConstraintName: 'fk_doctors_hospital' })
  hospital!: HospitalsEntity;
}