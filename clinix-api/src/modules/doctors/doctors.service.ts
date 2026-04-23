import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {DoctorsEntity} from '../../models/doctors_entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorsEntity)
    private readonly doctorRepository: Repository<DoctorsEntity>,
  ) {}

  findAll() {
    return this.doctorRepository.find({ relations: ['hospital'] });
  }

  findOne(id: number) {
    return this.doctorRepository.findOne({ where: { doctor_id: id }, relations: ['hospital'] });
  }

  create(doctor: Partial<DoctorsEntity>) {
    const newDoctor = this.doctorRepository.create(doctor);
    return this.doctorRepository.save(newDoctor);
  }

  update(id: number, doctor: Partial<DoctorsEntity>) {
    return this.doctorRepository.update({ doctor_id: id }, doctor);
  }

  remove(id: number) {
    return this.doctorRepository.delete({ doctor_id: id });
  }
}
