import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorsEntity } from '../../models/doctors_entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorsEntity])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
