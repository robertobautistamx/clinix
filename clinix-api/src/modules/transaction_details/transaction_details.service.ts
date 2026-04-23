import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDetailsEntity } from '../../models/transaction_details_entity';

@Injectable()
export class TransactionDetailsService {
  constructor(
    @InjectRepository(TransactionDetailsEntity)
    private readonly transactionDetailsRepository: Repository<TransactionDetailsEntity>,
  ) {}

  findAll() {
    return this.transactionDetailsRepository.find();
  }

  findOne(id: string) {
    return this.transactionDetailsRepository.findOneBy({ detail_id: id });
  }

  create(data: Partial<TransactionDetailsEntity>) {
    const newDetail = this.transactionDetailsRepository.create(data);
    return this.transactionDetailsRepository.save(newDetail);
  }

  update(id: string, data: Partial<TransactionDetailsEntity>) {
    return this.transactionDetailsRepository.update({ detail_id: id }, data);
  }

  remove(id: string) {
    return this.transactionDetailsRepository.delete({ detail_id: id });
  }
}
