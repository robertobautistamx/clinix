import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('symptoms_catalog')
@Unique('symptom_name', ['symptom_name'])

export class SymptomsCatalogEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  symptom_id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  symptom_name!: string;
}
