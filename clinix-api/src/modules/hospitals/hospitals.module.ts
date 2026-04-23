import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HospitalsController } from "./hospitals.controller";
import { HospitalsService } from "./hospitals.service";
import { HospitalsEntity } from "../../models/hospitals_entity";

@Module({
  imports: [TypeOrmModule.forFeature([HospitalsEntity])],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}