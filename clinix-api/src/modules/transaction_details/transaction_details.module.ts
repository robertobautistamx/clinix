import { Module } from '@nestjs/common';
import { TransactionDetailsController } from './transaction_details.controller';
import { TransactionDetailsService } from './transaction_details.service';

@Module({
  controllers: [TransactionDetailsController],
  providers: [TransactionDetailsService],
})
export class TransactionDetailsModule {}
