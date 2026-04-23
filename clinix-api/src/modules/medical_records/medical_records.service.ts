import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecordsEntity } from '../../models/medical_records_entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecordsEntity)
    private readonly medicalRecordsRepository: Repository<MedicalRecordsEntity>,
  ) {}

  findAll() {
    return this.medicalRecordsRepository.find({ relations: ['patient', 'doctor', 'hospital', 'diagnosis'] });
  }

  findOne(id: string) {
    return this.medicalRecordsRepository.findOne({ where: { record_id: id }, relations: ['patient', 'doctor', 'hospital', 'diagnosis'] });
  }

  create(data: Partial<MedicalRecordsEntity>) {
    const newRecord = this.medicalRecordsRepository.create(data);
    return this.medicalRecordsRepository.save(newRecord);
  }

  update(id: string, data: Partial<MedicalRecordsEntity>) {
    return this.medicalRecordsRepository.update({ record_id: id }, data);
  }

  remove(id: string) {
    return this.medicalRecordsRepository.delete({ record_id: id });
  }
}
