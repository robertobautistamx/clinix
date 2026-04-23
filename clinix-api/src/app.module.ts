import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      type: 'mysql',
      host: config.get<string>('DB_HOST', 'localhost'),
      port: parseInt(config.get<string>('DB_PORT') || '3307', 10),
      username: config.get<string>('DB_USERNAME', 'root'),
      password: config.get<string>('DB_PASSWORD', 'yg5dgM@n'),
      database: config.get<string>('DB_DATABASE', 'medical_db'),
      autoLoadEntities: true,
      synchronize: false,
    };
  },
}),
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
