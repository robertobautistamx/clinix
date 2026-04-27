import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { TransactionsEntity } from '../../models/transactions_entity';
import { ProductsEntity } from '../../models/products_entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsEntity, ProductsEntity])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
