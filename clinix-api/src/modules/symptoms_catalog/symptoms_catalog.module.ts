import { Module } from '@nestjs/common';
import { SymptomsCatalogController } from './symptoms_catalog.controller';
import { SymptomsCatalogService } from './symptoms_catalog.service';

@Module({
  controllers: [SymptomsCatalogController],
  providers: [SymptomsCatalogService],
})
export class SymptomsCatalogModule {}
