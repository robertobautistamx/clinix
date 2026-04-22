import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionDetailsService {
  findAll() {
    return [{ id: 1, detail: 'Detalle ejemplo' }];
  }
}
