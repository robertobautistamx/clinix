import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  findAll() {
    return this.hospitalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.hospitalsService.findOne(Number(id));
  }

  @Post()
  create(@Body() hospital: any) {
    return this.hospitalsService.create(hospital);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() hospital: any) {
    return this.hospitalsService.update(Number(id), hospital);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hospitalsService.remove(Number(id));
  }
}