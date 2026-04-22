import { Injectable } from "@nestjs/common";


@Injectable()
export class HospitalsService {
    findAll() {
        return [{ id: 1, name: 'General Hospital' }];
    }
}