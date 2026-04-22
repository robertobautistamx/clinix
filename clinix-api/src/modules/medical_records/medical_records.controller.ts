import { Controller, Get } from '@nestjs/common';
import { MedicalRecordsService } from './medical_records.service';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get()
  findAll() {
    return this.medicalRecordsService.findAll();
  }
}
