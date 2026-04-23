import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Icd10DiagnosesController } from './icd10_diagnoses.controller';
import { Icd10DiagnosesService } from './icd10_diagnoses.service';
import { Icd10DiagnosesEntity } from '../../models/icd10_diagnoses_entity';

@Module({
  imports: [TypeOrmModule.forFeature([Icd10DiagnosesEntity])],
  controllers: [Icd10DiagnosesController],
  providers: [Icd10DiagnosesService],
})
export class Icd10DiagnosesModule {}
