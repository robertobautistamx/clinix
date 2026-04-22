import { Injectable } from '@nestjs/common';

@Injectable()
export class InjuryMechanismsService {
  findAll() {
    return [{ id: 1, name: 'Corte' }];
  }
}
