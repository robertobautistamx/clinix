import { Injectable } from '@nestjs/common';

@Injectable()
export class MedicalRecordsService {
  findAll() {
    return [{ id: 1, description: 'Expediente ejemplo' }];
  }
}
