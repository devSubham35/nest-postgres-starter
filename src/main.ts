import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  /// api prefix - /api/v1
  app.setGlobalPrefix("api/v1")

  /// for global error format 
  app.useGlobalFilters(new HttpExceptionFilter())

  /// for common response interceptor
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
  );

  /// for global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
