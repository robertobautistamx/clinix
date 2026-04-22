import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { PatientsModule } from './modules/patients/patients.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { Icd10DiagnosesModule } from './modules/icd10_diagnoses/icd10_diagnoses.module';
import { InjuryMechanismsModule } from './modules/injury_mechanisms/injury_mechanisms.module';
import { MedicalRecordsModule } from './modules/medical_records/medical_records.module';
import { ProductsModule } from './modules/products/products.module';
import { SymptomsCatalogModule } from './modules/symptoms_catalog/symptoms_catalog.module';
import { TransactionDetailsModule } from './modules/transaction_details/transaction_details.module';

@Module({
  imports: [
    DoctorsModule,
    PatientsModule,
    HospitalsModule,
    TransactionsModule,
    Icd10DiagnosesModule,
    InjuryMechanismsModule,
    MedicalRecordsModule,
    ProductsModule,
    SymptomsCatalogModule,
    TransactionDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
