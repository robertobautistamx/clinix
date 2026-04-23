import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.patientsService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: any) {
    return this.patientsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.patientsService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientsService.remove(Number(id));
  }
}
