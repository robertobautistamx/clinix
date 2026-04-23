import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SymptomsCatalogService } from './symptoms_catalog.service';

@Controller('symptoms-catalog')
export class SymptomsCatalogController {
  constructor(private readonly symptomsCatalogService: SymptomsCatalogService) {}

  @Get()
  findAll() {
    return this.symptomsCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.symptomsCatalogService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: any) {
    return this.symptomsCatalogService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.symptomsCatalogService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.symptomsCatalogService.remove(Number(id));
  }
}
