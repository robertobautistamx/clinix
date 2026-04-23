import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymptomsCatalogController } from './symptoms_catalog.controller';
import { SymptomsCatalogService } from './symptoms_catalog.service';
import { SymptomsCatalogEntity } from '../../models/symptoms_catalog_entity';

@Module({
  imports: [TypeOrmModule.forFeature([SymptomsCatalogEntity])],
  controllers: [SymptomsCatalogController],
  providers: [SymptomsCatalogService],
})
export class SymptomsCatalogModule {}
