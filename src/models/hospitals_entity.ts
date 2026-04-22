import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('hospitals')
@Index('idx_city', ['city'])

export class HospitalsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  hospital_id!: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  hospital_type!: string;

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

  @Column({ type: 'smallint', nullable: false })
  capacity_beds!: number;

  @Column({ type: 'tinyint', width: 1, default: () => '1', nullable: false })
  accredited!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at!: Date;
}