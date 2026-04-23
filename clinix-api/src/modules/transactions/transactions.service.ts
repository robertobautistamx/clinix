import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsEntity } from '../../models/transactions_entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
  ) {}

  findAll() {
    return this.transactionsRepository.find({ relations: ['patient', 'doctor', 'hospital', 'product', 'diagnosis'] });
  }

  findOne(id: string) {
    return this.transactionsRepository.findOne({ where: { transaction_id: id }, relations: ['patient', 'doctor', 'hospital', 'product', 'diagnosis'] });
  }

  create(data: Partial<TransactionsEntity>) {
    const newTransaction = this.transactionsRepository.create(data);
    return this.transactionsRepository.save(newTransaction);
  }

  update(id: string, data: Partial<TransactionsEntity>) {
    return this.transactionsRepository.update({ transaction_id: id }, data);
  }

  remove(id: string) {
    return this.transactionsRepository.delete({ transaction_id: id });
  }
}
