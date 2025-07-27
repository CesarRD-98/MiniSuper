import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '@categoria/entities/categoria.entity';
import { Producto } from '@producto/entities/producto.entity';
import { CategoriaModule } from '@categoria/categoria.module';
import { ProductoModule } from '@producto/producto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ResponseModule } from '@common/services/response/response.module';
import { Usuario } from '@usuario/entities/usuario.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Categoria, Producto, Usuario],
        synchronize: true,
        autoLoadEntities: true
      })
    }),
    ResponseModule,
    CategoriaModule,
    ProductoModule,
    UsuarioModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
