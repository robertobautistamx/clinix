import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SymptomsCatalogEntity } from '../../models/symptoms_catalog_entity';

@Injectable()
export class SymptomsCatalogService {
  constructor(
    @InjectRepository(SymptomsCatalogEntity)
    private readonly symptomsCatalogRepository: Repository<SymptomsCatalogEntity>,
  ) {}

  findAll() {
    return this.symptomsCatalogRepository.find();
  }

  findOne(id: number) {
    return this.symptomsCatalogRepository.findOneBy({ symptom_id: id });
  }

  create(data: Partial<SymptomsCatalogEntity>) {
    const newSymptom = this.symptomsCatalogRepository.create(data);
    return this.symptomsCatalogRepository.save(newSymptom);
  }

  update(id: number, data: Partial<SymptomsCatalogEntity>) {
    return this.symptomsCatalogRepository.update({ symptom_id: id }, data);
  }

  remove(id: number) {
    return this.symptomsCatalogRepository.delete({ symptom_id: id });
  }
}
