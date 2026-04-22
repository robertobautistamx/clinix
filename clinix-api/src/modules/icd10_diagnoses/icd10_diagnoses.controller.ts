import { Controller, Get } from '@nestjs/common';
import { Icd10DiagnosesService } from './icd10_diagnoses.service';

@Controller('icd10-diagnoses')
export class Icd10DiagnosesController {
	constructor(private readonly icd10DiagnosesService: Icd10DiagnosesService) {}

	@Get()
	findAll() {
		return this.icd10DiagnosesService.findAll();
	}
}
