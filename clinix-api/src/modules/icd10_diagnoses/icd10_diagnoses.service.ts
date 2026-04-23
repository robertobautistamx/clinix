import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icd10DiagnosesEntity } from '../../models/icd10_diagnoses_entity';

@Injectable()
export class Icd10DiagnosesService {
  constructor(
    @InjectRepository(Icd10DiagnosesEntity)
    private readonly icd10DiagnosesRepository: Repository<Icd10DiagnosesEntity>,
  ) {}

  findAll() {
    return this.icd10DiagnosesRepository.find();
  }

  findOne(id: number) {
    return this.icd10DiagnosesRepository.findOne({ where: { diagnosis_id: id } });
  }

  create(data: Partial<Icd10DiagnosesEntity>) {
    const newDiagnosis = this.icd10DiagnosesRepository.create(data);
    return this.icd10DiagnosesRepository.save(newDiagnosis);
  }

  update(id: number, data: Partial<Icd10DiagnosesEntity>) {
    return this.icd10DiagnosesRepository.update({ diagnosis_id: id }, data);
  }

  remove(id: number) {
    return this.icd10DiagnosesRepository.delete({ diagnosis_id: id });
  }
}
