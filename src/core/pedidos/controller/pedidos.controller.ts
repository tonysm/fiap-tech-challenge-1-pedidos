import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { ItemVO } from './../vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PedidosRepositoryInterface } from './../repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosControllerInterface } from './pedidos.controller.interface';
import { PedidosServiceInterface } from '../pedido.service.interface';
import { PedidosService } from '../pedidos.service';
import { PagamentosService } from 'src/externals/services/pagamentos.service';
import { PagamentosServiceInterface } from '../services/pagamentos.service.interface';
import { ProducaoServiceInterface } from '../services/producao.service.interface';
import { ProducaoService } from 'src/externals/services/producao.service';

@Injectable()
export class PedidosController implements PedidosControllerInterface {
  constructor(
    @Inject(PedidosRepository)
    private readonly repository: PedidosRepositoryInterface,
    @Inject(PedidosService)
    private readonly pedidosService: PedidosServiceInterface,
    @Inject(PagamentosService)
    private readonly pagamentosService: PagamentosServiceInterface,
    @Inject(ProducaoService)
    private readonly producaoService: ProducaoServiceInterface,
  ) {}

  findAll() {
    return this.pedidosService.findAll();
  }

  findOne(id: number) {
    return this.pedidosService.findOne(id);
  }

  async create(input: CreatePedidoDto) {
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
    return await this.pedidosService.solicitarPagamento(pedidoId, this.pagamentosService)
  }

  async confirmaPagamento(pedidoId: number, pagoComSucesso: boolean) {
    return await this.pedidosService.confirmarPagamento(pedidoId, pagoComSucesso, this.producaoService)
  }

  async finalizar(pedidoId: number) {
    return await this.pedidosService.finalizar(pedidoId)
  }
}
