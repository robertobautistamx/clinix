import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TransactionDetailsService } from './transaction_details.service';

@Controller('transaction-details')
export class TransactionDetailsController {
  constructor(private readonly transactionDetailsService: TransactionDetailsService) {}

  @Get()
  findAll() {
    return this.transactionDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionDetailsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.transactionDetailsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.transactionDetailsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionDetailsService.remove(id);
  }
}
