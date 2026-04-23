import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../../models/products_entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) {}

  findAll() {
    return this.productsRepository.find();
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ where: { product_id: id } });
  }

  create(data: Partial<ProductsEntity>) {
    const newProduct = this.productsRepository.create(data);
    return this.productsRepository.save(newProduct);
  }

  update(id: number, data: Partial<ProductsEntity>) {
    return this.productsRepository.update({ product_id: id }, data);
  }

  remove(id: number) {
    return this.productsRepository.delete({ product_id: id });
  }
}
