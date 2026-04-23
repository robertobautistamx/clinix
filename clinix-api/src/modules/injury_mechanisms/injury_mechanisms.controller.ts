import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InjuryMechanismsService } from './injury_mechanisms.service';

@Controller('injury-mechanisms')
export class InjuryMechanismsController {
  constructor(private readonly injuryMechanismsService: InjuryMechanismsService) {}

  @Get()
  findAll() {
    return this.injuryMechanismsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.injuryMechanismsService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: any) {
    return this.injuryMechanismsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.injuryMechanismsService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.injuryMechanismsService.remove(Number(id));
  }
}
