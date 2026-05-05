# Clinix - Plataforma de Gestión Clínica

Clinix es una solución integral para la gestión clínica, compuesta por un frontend moderno (React) y un backend robusto (NestJS). Permite administrar pacientes, doctores, hospitales, productos, transacciones y más, facilitando la operación de centros médicos y farmacias.

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Repositorios y Carpetas](#repositorios-y-carpetas)
- [Instalación Rápida](#instalación-rápida)
- [Requisitos](#requisitos)
- [Licencia](#licencia)

## Descripción General
Clinix centraliza la información clínica y operativa, permitiendo la gestión eficiente de recursos médicos, pacientes, productos y transacciones. La plataforma está dividida en dos proyectos principales:

- **clinix/mi-app**: Frontend en React + TypeScript
- **clinix-api**: Backend en NestJS + TypeORM

## Arquitectura

```
Clinix/
├── clinix-api/    # Backend (NestJS)
└── mi-app/        # Frontend (React)
```

- Comunicación vía API RESTful
- Separación clara entre frontend y backend
- Escalable y modular

## Repositorios y Carpetas
- **clinix-api/**: API RESTful, lógica de negocio, acceso a base de datos
- **mi-app/**: Interfaz de usuario, consumo de API, gestión de estado

Cada carpeta contiene su propio README con instrucciones detalladas.

## Instalación Rápida

1. Clona el repositorio principal:
   ```bash
   git clone <REPO_URL>
   cd Clinix
   ```
2. Sigue las instrucciones de instalación en los README de `clinix-api` y `mi-app`.

## Requisitos
- Node.js >= 18
- npm >= 9
- Base de datos compatible con TypeORM (ej: MySQL, PostgreSQL)

## Licencia
Este proyecto es privado y no cuenta con una licencia pública.
