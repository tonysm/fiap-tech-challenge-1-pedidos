import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { Status, StatusPagamento } from './../entities/pedido.entity';
import { PedidoAggregateFactory } from './../aggregates/pedido.aggregate.factory';
import { PagamentoFalhou, StatusInvalidoException } from './../exceptions/pedido.exception';
import { ItemVO } from './../vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PagamentoGateway } from '../../pagamentos/pagamento.gateway';
import { PedidosRepositoryInterface } from './../repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosControllerInterface } from './pedidos.controller.interface';
import { PedidosServiceInterface } from '../pedido.service.interface';
import { PedidosService } from '../pedidos.service';

@Injectable()
export class PedidosController implements PedidosControllerInterface {
  constructor(
    @Inject(PedidosRepository)
    private readonly repository: PedidosRepositoryInterface,
    @Inject(PedidosService)
    private readonly pedidosService: PedidosServiceInterface
  ) {}

  findAll() {
    return this.pedidosService.findAll()
  }

  findAllParaCozinha() {
    return this.pedidosService.findAllParaCozinha()
  }

  findOne(id: number) {
    return this.pedidosService.findOne(id)
  }

  async create(input: CreatePedidoDto) {
    const pedidoCriado = await this.pedidosService.create(input)
    return this.repository.save(pedidoCriado);
  }

  async addItem(id: number, item: ItemVO) {
    const pedidoAtualizado = await this.pedidosService.addItem(id, item)
    return this.repository.save(pedidoAtualizado);
  }

  async updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto) {
    const pedidoAtualizado = await this.pedidosService.updateItem(pedidoId, itemId, input)
    return this.repository.save(pedidoAtualizado);
  }

  findOneItem(id: number) {
    return this.pedidosService.findOneItem(id)
  }

  async removeItem(pedidoId: number, id: number) {
    const pedidoAtualizado = await this.pedidosService.removeItem(pedidoId, id)
  }

  async confirmaPagamento(pedidoId: number, pagamentos: PagamentoGateway) {
    const pedidoAtualizado = await this.pedidosService.confirmaPagamento(pedidoId, pagamentos)
    const pedido = await this.repository.save(pedidoAtualizado)

    if (pedidoAtualizado.statusPagamento === StatusPagamento.FALHOU) {
        throw new PagamentoFalhou(pedidoAtualizado);
    }
  }

  async atualizaStatusDoPedido(id: number, status: Status) {
    const pedidoAtualizado = await this.pedidosService.atualizaStatusDoPedido(id, status)
    this.repository.save(pedidoAtualizado)
  }
}