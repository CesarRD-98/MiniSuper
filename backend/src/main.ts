import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; 
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

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

