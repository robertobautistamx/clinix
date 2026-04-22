
# Clinix API

API RESTful para gestión clínica, desarrollada con [NestJS](https://nestjs.com/) y [TypeORM](https://typeorm.io/) en TypeScript.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelos y Entidades](#modelos-y-entidades)
- [Instalación](#instalación)
- [Comandos Útiles](#comandos-útiles)
- [Testing](#testing)
- [Licencia](#licencia)

## Descripción
Clinix API es un backend modular para la gestión de hospitales, pacientes, médicos, diagnósticos, productos, transacciones y más. Permite la integración y administración de información clínica y operativa.

## Estructura del Proyecto

```
clinix-api/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── models/
│   │   ├── doctors_entity.ts
│   │   ├── hospitals_entity.ts
│   │   ├── icd10_diagnoses_entity.ts
│   │   ├── injury_mechanisms_entity.ts
│   │   ├── medical_records_entity.ts
│   │   ├── patients_entity.ts
│   │   ├── products_entity.ts
│   │   ├── symptoms_catalog_entity.ts
│   │   ├── transactions_entity.ts
│   │   └── transaction_details_entity.ts
│   └── modules/
│       └── doctors.ts
├── test/
│   └── app.e2e-spec.ts
├── package.json
├── tsconfig.json
├── nest-cli.json
└── ...
```

## Modelos y Entidades
El sistema cuenta con entidades para:
- Doctores
- Hospitales
- Diagnósticos (ICD10)
- Mecanismos de lesión
- Expedientes médicos
- Pacientes
- Productos
- Catálogo de síntomas
- Transacciones y detalles de transacción

Cada entidad está definida en la carpeta `src/models` y mapea directamente a una tabla SQL.

## Instalación

```bash
npm install
```

## Comandos Útiles

```bash
# Compilar y ejecutar en desarrollo
npm run start:dev

# Compilar para producción
npm run build
npm run start:prod

# Lint y formato
npm run lint
npm run format
```

## Testing

```bash
# Pruebas unitarias
npm run test

# Pruebas end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```

## Dependencias principales
- NestJS 11
- TypeORM
- Jest (testing)
- ESLint & Prettier

## Licencia
Este proyecto es privado y no cuenta con una licencia pública.