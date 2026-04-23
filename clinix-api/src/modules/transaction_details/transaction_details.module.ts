import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetailsController } from './transaction_details.controller';
import { TransactionDetailsService } from './transaction_details.service';
import { TransactionDetailsEntity } from '../../models/transaction_details_entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionDetailsEntity])],
  controllers: [TransactionDetailsController],
  providers: [TransactionDetailsService],
})
export class TransactionDetailsModule {}
