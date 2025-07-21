import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, forbidNonWhitelisted: true, transform: true
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  })

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT') ?? 5000

  await app.listen(port)
  console.log(`🎉 server running on port:${port}`);
}
bootstrap();

// ✅
// ❌
// ⚠️
// ℹ️
// 🚀
// 🔄
// 📦
// 🔍
// 🛠️
// 🧪
// 🎉 

