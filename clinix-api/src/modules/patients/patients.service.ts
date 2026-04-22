import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  findAll() {
    return [{ id: 1, name: 'Paciente Ejemplo' }];
  }
}
