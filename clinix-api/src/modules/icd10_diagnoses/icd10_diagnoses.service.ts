import { Injectable } from '@nestjs/common';

@Injectable()
export class Icd10DiagnosesService {
  findAll() {
    return [{ code: 'A00', description: 'Cólera' }];
  }
}
