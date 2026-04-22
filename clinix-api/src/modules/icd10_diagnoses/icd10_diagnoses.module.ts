import { Module } from '@nestjs/common';
import { Icd10DiagnosesController } from './icd10_diagnoses.controller';
import { Icd10DiagnosesService } from './icd10_diagnoses.service';

@Module({
  controllers: [Icd10DiagnosesController],
  providers: [Icd10DiagnosesService],
})
export class Icd10DiagnosesModule {}
