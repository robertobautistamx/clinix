import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientsEntity } from '../../models/patients_entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientsEntity)
    private readonly patientsRepository: Repository<PatientsEntity>,
  ) {}

  findAll() {
    return this.patientsRepository.find();
  }

  findOne(id: number) {
    return this.patientsRepository.findOne({ where: { patient_id: id } });
  }

  create(data: Partial<PatientsEntity>) {
    const newPatient = this.patientsRepository.create(data);
    return this.patientsRepository.save(newPatient);
  }

  update(id: number, data: Partial<PatientsEntity>) {
    return this.patientsRepository.update({ patient_id: id }, data);
  }

  remove(id: number) {
    return this.patientsRepository.delete({ patient_id: id });
  }
}
