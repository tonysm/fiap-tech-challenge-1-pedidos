import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { ItemVO } from './../vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PedidosRepositoryInterface } from './../repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosControllerInterface } from './pedidos.controller.interface';
import { PedidosServiceInterface } from '../pedido.service.interface';
import { PedidosService } from '../pedidos.service';
import { ClientesServiceInterface } from 'src/core/clientes/clientes.service.interface';
import { ClientesService } from 'src/core/clientes/clientes.service';

@Injectable()
export class PedidosController implements PedidosControllerInterface {
  constructor(
    @Inject(PedidosRepository)
    private readonly repository: PedidosRepositoryInterface,
    @Inject(PedidosService)
    private readonly pedidosService: PedidosServiceInterface,
    @Inject(ClientesService)
    private readonly clientes: ClientesServiceInterface,
  ) {}

  findAll() {
    return this.pedidosService.findAll();
  }

  findOne(id: number) {
    return this.pedidosService.findOne(id);
  }

  async create(input: CreatePedidoDto) {
    if (!(await this.clientes.isActive(input.clienteId))) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const pedidoCriado = await this.pedidosService.create(input);
    return this.repository.save(pedidoCriado);
  }

  async addItem(id: number, item: ItemVO) {
    const pedidoAtualizado = await this.pedidosService.addItem(id, item);
    return this.repository.save(pedidoAtualizado);
  }

  async updateItem(
    pedidoId: number,
    itemId: number,
    input: UpdatePedidoItemDto,
  ) {
    const pedidoAtualizado = await this.pedidosService.updateItem(
      pedidoId,
      itemId,
      input,
    );

    return this.repository.save(pedidoAtualizado);
  }

  findOneItem(id: number) {
    return this.pedidosService.findOneItem(id);
  }

  async removeItem(pedidoId: number, id: number) {
    return await this.pedidosService.removeItem(pedidoId, id);
  }

  async solicitarPagamento(pedidoId: number) {
    return await this.pedidosService.solicitarPagamento(pedidoId);
  }

  async finalizar(pedidoId: number) {
    return await this.pedidosService.finalizar(pedidoId);
  }
}
