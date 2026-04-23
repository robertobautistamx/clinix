import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjuryMechanismsController } from './injury_mechanisms.controller';
import { InjuryMechanismsService } from './injury_mechanisms.service';
import { InjuryMechanismsEntity } from '../../models/injury_mechanisms_entity';

@Module({
  imports: [TypeOrmModule.forFeature([InjuryMechanismsEntity])],
  controllers: [InjuryMechanismsController],
  providers: [InjuryMechanismsService],
})
export class InjuryMechanismsModule {}
