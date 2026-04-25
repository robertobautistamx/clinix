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

 async findAll({ page, limit }: { page: number; limit: number }) {
  const [data, total] = await this.doctorRepository.findAndCount({
    take: limit,
    skip: (page - 1) * limit,
    order: { doctor_id: 'DESC' },
  });
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
