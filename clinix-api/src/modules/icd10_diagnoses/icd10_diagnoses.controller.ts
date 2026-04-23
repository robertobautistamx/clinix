import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Icd10DiagnosesService } from './icd10_diagnoses.service';

@Controller('icd10-diagnoses')
export class Icd10DiagnosesController {
	constructor(private readonly icd10DiagnosesService: Icd10DiagnosesService) {}

	@Get()
	findAll() {
		return this.icd10DiagnosesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.icd10DiagnosesService.findOne(Number(id));
	}

	@Post()
	create(@Body() data: any) {
		return this.icd10DiagnosesService.create(data);
	}

	@Put(':id')
	update(@Param('id') id: number, @Body() data: any) {
		return this.icd10DiagnosesService.update(Number(id), data);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.icd10DiagnosesService.remove(Number(id));
	}
}
