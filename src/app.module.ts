import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PedidosModule } from './core/pedidos/pedidos.module';
import { ProdutosModule } from './core/produtos/produtos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './core/clientes/clientes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory(configService: ConfigService) {
            return {
                type: 'mysql',
                host: '/cloudsql/' + configService.get<string>('DB_HOST'),
                extra: {
                  socketPath: '/cloudsql/' + configService.get<string>('DB_HOST'),
                },
                port: 3306,
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [__dirname + '/core/**/*.entity{.ts,.js}'],
                synchronize: true
            }
        },
        inject: [ConfigService],
    }),
    PedidosModule,
    ProdutosModule,
    ClientesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
