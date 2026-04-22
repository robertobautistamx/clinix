import { Injectable } from '@nestjs/common';

@Injectable()
export class SymptomsCatalogService {
  findAll() {
    return [{ id: 1, name: 'Fiebre' }];
  }
}
