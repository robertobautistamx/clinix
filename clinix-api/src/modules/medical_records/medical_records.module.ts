import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecordsService } from './medical_records.service';
import { MedicalRecordsEntity } from '../../models/medical_records_entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecordsEntity])],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
