import { Controller, Get } from '@nestjs/common';
import { SymptomsCatalogService } from './symptoms_catalog.service';

@Controller('symptoms-catalog')
export class SymptomsCatalogController {
  constructor(private readonly symptomsCatalogService: SymptomsCatalogService) {}

  @Get()
  findAll() {
    return this.symptomsCatalogService.findAll();
  }
}
