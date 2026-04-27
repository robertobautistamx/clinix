
# Clinix API (Backend)

API RESTful para gestión clínica, desarrollada con [NestJS](https://nestjs.com/) y [TypeORM](https://typeorm.io/) en TypeScript. Provee endpoints para la administración de hospitales, pacientes, médicos, diagnósticos, productos, transacciones y más.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos y Endpoints](#módulos-y-endpoints)
- [Modelos y Entidades](#modelos-y-entidades)
- [Instalación](#instalación)
- [Comandos Útiles](#comandos-útiles)
- [Testing](#testing)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

## Descripción
Clinix API es un backend modular que centraliza la gestión de información clínica y operativa. Permite la integración con sistemas frontend y facilita la administración de recursos médicos, pacientes, productos y transacciones.

## Estructura del Proyecto

```
clinix-api/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── models/         # Entidades TypeORM
│   └── modules/        # Módulos por dominio (doctores, hospitales, etc.)
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── ...
```

## Módulos y Endpoints

Cada módulo implementa un CRUD básico y puede incluir endpoints adicionales según la lógica de negocio. Ejemplo de módulos disponibles:

- **Doctores**: `/doctors` (GET, POST, PUT, DELETE)
- **Pacientes**: `/patients` (GET, POST, PUT, DELETE)
- **Hospitales**: `/hospitals` (GET, POST, PUT, DELETE)
- **Productos**: `/products` (GET, POST, PUT, DELETE)
- **Diagnósticos ICD10**: `/icd10-diagnoses`
- **Expedientes médicos**: `/medical-records`
- **Transacciones**: `/transactions`
- **Recomendaciones**: `/recommendations`

Cada módulo se encuentra en `src/modules/<modulo>` y sigue la arquitectura estándar de NestJS (controller, service, module).

## Modelos y Entidades

Las entidades están en `src/models` y representan las tablas principales:

- doctors_entity.ts
- hospitals_entity.ts
- icd10_diagnoses_entity.ts
- injury_mechanisms_entity.ts
- medical_records_entity.ts
- patients_entity.ts
- products_entity.ts
- symptoms_catalog_entity.ts
- transactions_entity.ts
- transaction_details_entity.ts

## Instalación

1. Instala las dependencias:
	```bash
	npm install
	```
2. Configura la base de datos en tu archivo `.env` (ver ejemplo en `.env.example` si existe).
3. Ejecuta la API en modo desarrollo:
	```bash
	npm run start:dev
	```

## Comandos Útiles

- `npm run start:dev`   : Ejecuta en modo desarrollo
- `npm run build`       : Compila para producción
- `npm run start:prod`  : Ejecuta build en modo producción
- `npm run lint`        : Linting de código
- `npm run format`      : Formatea el código

## Testing

- `npm run test`      : Pruebas unitarias
- `npm run test:e2e`  : Pruebas end-to-end
- `npm run test:cov`  : Cobertura de tests

## Variables de Entorno

Configura tu archivo `.env` con los siguientes valores mínimos:

- `DB_HOST`     : Host de la base de datos
- `DB_PORT`     : Puerto
- `DB_USERNAME` : Usuario
- `DB_PASSWORD` : Contraseña
- `DB_DATABASE` : Nombre de la base de datos

## Dependencias principales
- NestJS 11
- TypeORM
- Jest (testing)
- ESLint & Prettier

## Licencia
Este proyecto es privado y no cuenta con una licencia pública.