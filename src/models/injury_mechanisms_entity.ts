import { Column, Entity, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('injury_mechanisms')

export class InjuryMechanismsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  mechanism_id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  mechanism_name!: string;
}