import { Module } from '@nestjs/common';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecordsService } from './medical_records.service';

@Module({
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
