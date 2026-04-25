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

  async findAll(page: number = 1, limit: number = 50) {
    const [data, total] = await this.transactionsRepository.findAndCount({
      relations: ['patient', 'doctor', 'hospital', 'product', 'diagnosis'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: string) {
    return this.transactionsRepository.findOne({ where: { transaction_id: id }, relations: ['patient', 'doctor', 'hospital', 'product', 'diagnosis'] });
  }

  create(data: any) {
    const newTransaction = this.transactionsRepository.create({
      ...data,
      transaction_code: data.transaction_code || `TXN-${Date.now()}`,
      total_amount: data.total_amount ?? data.total ?? 0,
      transaction_date: data.transaction_date || new Date(),
      status: data.status || 'COMPLETED',
      transaction_type: data.transaction_type || 'SALE',
      currency: data.currency || 'MXN'
    });
    return this.transactionsRepository.save(newTransaction);
  }

  update(id: string, data: Partial<TransactionsEntity>) {
    return this.transactionsRepository.update({ transaction_id: id }, data);
  }

  remove(id: string) {
    return this.transactionsRepository.delete({ transaction_id: id });
  }
}
