import { Module } from '@nestjs/common';
import { InjuryMechanismsController } from './injury_mechanisms.controller';
import { InjuryMechanismsService } from './injury_mechanisms.service';

@Module({
  controllers: [InjuryMechanismsController],
  providers: [InjuryMechanismsService],
})
export class InjuryMechanismsModule {}
