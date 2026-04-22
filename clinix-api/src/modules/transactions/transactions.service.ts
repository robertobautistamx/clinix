import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  findAll() {
    return [{ id: 1, description: 'Transacción Ejemplo' }];
  }
}
