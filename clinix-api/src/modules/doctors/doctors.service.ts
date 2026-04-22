import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorsService {
  findAll() {
    return [{ id: 1, name: 'Dr. Smith' }];
  }
}
