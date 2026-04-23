import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjuryMechanismsEntity } from '../../models/injury_mechanisms_entity';

@Injectable()
export class InjuryMechanismsService {
  constructor(
    @InjectRepository(InjuryMechanismsEntity)
    private readonly injuryMechanismsRepository: Repository<InjuryMechanismsEntity>,
  ) {}

  findAll() {
    return this.injuryMechanismsRepository.find();
  }

  findOne(id: number) {
    return this.injuryMechanismsRepository.findOneBy({ mechanism_id: id });
  }

  create(data: Partial<InjuryMechanismsEntity>) {
    const newMechanism = this.injuryMechanismsRepository.create(data);
    return this.injuryMechanismsRepository.save(newMechanism);
  }

  update(id: number, data: Partial<InjuryMechanismsEntity>) {
    return this.injuryMechanismsRepository.update({ mechanism_id: id }, data);
  }

  remove(id: number) {
    return this.injuryMechanismsRepository.delete({ mechanism_id: id });
  }
}
