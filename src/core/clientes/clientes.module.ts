import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from '../../adapter/driver/controllers/clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClientesRepositoryInterface } from './repositories/clientes.repository';
import { ClientesRepository } from 'src/adapter/driven/infrastructure/repositories/clientes.repository';
import { ClientesServiceInterface } from './clientes.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesRepository, ClientesService, {
    provide: ClientesRepositoryInterface,
    useClass: ClientesRepository,
  }, {
    provide: ClientesServiceInterface,
    useClass: ClientesService
  }],
  exports: [ClientesRepository]
})
export class ClientesModule {}
