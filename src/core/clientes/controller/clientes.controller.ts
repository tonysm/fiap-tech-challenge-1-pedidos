import { Inject, Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';
import { ClientesControllerInterface } from './clientes.controller.interface';
import { ClientesServiceInterface } from '../clientes.service.interface';
import { ClientesService } from '../clientes.service';
import { PedidosRepositoryInterface } from 'src/core/pedidos/repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';

@Injectable()
export class ClientesController implements ClientesControllerInterface {
  constructor(
    @Inject(ClientesService)
    private clientes: ClientesServiceInterface,
    @Inject(PedidosRepository)
    private pedidos: PedidosRepositoryInterface,
  ) {}

  async create(input: CreateClienteDto) {
    return await this.clientes.create(input);
  }

  findAll() {
    return this.clientes.findAll();
  }

  async findOne(id: number) {
    return await this.clientes.findOne(id);
  }

  findByCpf(cpf: string) {
    return this.clientes.findByCpf(cpf);
  }

  async update(id: number, input: UpdateClienteDto) {
    return await this.clientes.update(id, input);
  }

  async remove(id: number) {
    this.clientes.remove(id);
    this.pedidos.cancelarPedidosPendentes(id);
  }
}
