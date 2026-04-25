import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

 @Get()
findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 50,
) {
  return this.doctorsService.findAll({ page: +page, limit: +limit });
}
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorsService.findOne(Number(id));
  }

  @Post()
  create(@Body() doctor: any) {
    return this.doctorsService.create(doctor);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() doctor: any) {
    return this.doctorsService.update(Number(id), doctor);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorsService.remove(Number(id));
  }
}
