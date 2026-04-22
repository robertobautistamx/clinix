import { Controller, Get } from '@nestjs/common';
import { InjuryMechanismsService } from './injury_mechanisms.service';

@Controller('injury-mechanisms')
export class InjuryMechanismsController {
  constructor(private readonly injuryMechanismsService: InjuryMechanismsService) {}

  @Get()
  findAll() {
    return this.injuryMechanismsService.findAll();
  }
}
