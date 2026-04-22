import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true, });
  app.setGlobalPrefix('api/v1');
  console.clear();
  console.log(`
====================================================
   Server running on port: ${process.env.PORT ?? 3000}
   Environment: ${process.env.NODE_ENV ?? 'development'}
====================================================

   ██████╗ ██╗     ██╗███╗   ██╗██╗██╗  ██╗
  ██╔════╝ ██║     ██║████╗  ██║██║╚██╗██╔╝
  ██║      ██║     ██║██╔██╗ ██║██║ ╚███╔╝ 
  ██║      ██║     ██║██║╚██╗██║██║ ██╔██╗ 
  ╚██████╗ ███████╗██║██║ ╚████║██║██╔╝ ██╗
   ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
           clinix-api is up and running!
====================================================
`);
bootstrap();
}