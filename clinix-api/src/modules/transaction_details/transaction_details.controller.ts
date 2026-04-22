import { Controller, Get } from '@nestjs/common';
import { TransactionDetailsService } from './transaction_details.service';

@Controller('transaction-details')
export class TransactionDetailsController {
  constructor(private readonly transactionDetailsService: TransactionDetailsService) {}

  @Get()
  findAll() {
    return this.transactionDetailsService.findAll();
  }
}
