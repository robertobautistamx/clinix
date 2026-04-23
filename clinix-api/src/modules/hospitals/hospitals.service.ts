import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalsEntity } from '../../models/hospitals_entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(HospitalsEntity)
    private readonly hospitalRepository: Repository<HospitalsEntity>,
  ) {}

  findAll() {
    return this.hospitalRepository.find();
  }

  findOne(id: number) {
    return this.hospitalRepository.findOne({ where: { hospital_id: id } });
  }

  create(hospital: Partial<HospitalsEntity>) {
    const newHospital = this.hospitalRepository.create(hospital);
    return this.hospitalRepository.save(newHospital);
  }

  update(id: number, hospital: Partial<HospitalsEntity>) {
    return this.hospitalRepository.update({ hospital_id: id }, hospital);
  }

  remove(id: number) {
    return this.hospitalRepository.delete({ hospital_id: id });
  }
}