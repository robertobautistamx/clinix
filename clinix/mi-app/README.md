# Clinix App (Frontend)

Aplicación web para la gestión clínica, desarrollada en React y TypeScript. Permite la administración de pacientes, doctores, hospitales, productos, transacciones y recomendaciones, integrándose con la API de Clinix.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Principales](#tecnologías-principales)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

## Descripción
Clinix App es una interfaz web moderna para la gestión integral de información clínica y operativa. Permite visualizar, agregar y administrar pacientes, médicos, hospitales, productos y transacciones, con funcionalidades de carrito de compras y recomendaciones.

## Tecnologías Principales
- React 19
- TypeScript
- Context API (manejo de estado global)
- Fetch/Axios para consumo de API REST
- CSS personalizado

## Instalación

1. Clona el repositorio y entra a la carpeta `mi-app`:
	```bash
	git clone <REPO_URL>
	cd clinix/mi-app
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Crea un archivo `.env` y define la URL de la API:
	```env
	REACT_APP_API_URL=http://localhost:3000/api/v1
	```
4. Inicia la aplicación en modo desarrollo:
	```bash
	npm start
	```

## Scripts Disponibles

- `npm start`     : Ejecuta la app en modo desarrollo
- `npm run build` : Genera una build de producción
- `npm test`      : Ejecuta los tests
- `npm run eject` : Expone la configuración de Create React App

## Estructura de Carpetas

```
mi-app/
├── public/           # Archivos estáticos y HTML base
├── src/
│   ├── components/   # Componentes reutilizables (Sidebar, Modal, Paginacion)
│   ├── context/      # Contextos globales (Carrito)
│   ├── hooks/        # Custom hooks (useFetch)
│   ├── pages/        # Vistas principales (Pacientes, Doctores, Productos, etc.)
│   ├── services/     # Servicios para consumo de API
│   ├── App.tsx       # Componente principal
│   └── index.tsx     # Punto de entrada
└── package.json
```

## Variables de Entorno

- `REACT_APP_API_URL`: URL base de la API backend (por defecto: http://localhost:3000/api/v1)

## Licencia
Este proyecto es privado y no cuenta con una licencia pública.
