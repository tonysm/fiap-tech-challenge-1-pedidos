import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ItemVO } from "../vo/item.vo";
import { CreatePedidoDto } from "src/adapter/driver/controllers/dto/create-pedido.dto";
import { PedidoAggregate } from "./pedido.aggregate";
import { Inject, Injectable } from "@nestjs/common";
import { ClientesRepository } from "src/adapter/driven/infrastructure/repositories/clientes.repository";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository";
import { Status, StatusPagamento } from "../entities/pedido.entity";
import { PedidosRepositoryInterface } from "../repositories/pedidos.repository";
import { PedidosRepository } from "src/adapter/driven/infrastructure/repositories/pedidos.repository";

@Injectable()
export class PedidoAggregateFactory {
  constructor(
    @Inject(ClientesRepository)
    private clientesRepository: ClientesRepositoryInterface,
    @Inject(PedidosRepository)
    private pedidosRepository: PedidosRepositoryInterface
  ) { }

  async createNew(input: CreatePedidoDto): Promise<PedidoAggregate> {
    let cliente: Cliente = null

    if (input.clienteId) {
      cliente = await this.clientesRepository.findById(input.clienteId)
    }

    return new PedidoAggregate(
      Status.CRIANDO,
      StatusPagamento.PENDENTE,
      [],
      cliente,
    )
  }

  async createFromId(pedidoId: number): Promise<PedidoAggregate> {
    const pedido = await this.pedidosRepository.findOneOrFail(pedidoId)

    const itensVO = pedido.itens.map(element => {
      const itemVO = new ItemVO(
        element.quantidade,
        element.produto,
        element.observacao,
        element.precoUnitario
      )
      itemVO.id = element.id
      return itemVO
    })

    const aggregate = new PedidoAggregate(
      pedido.status,
      pedido.statusPagamento,
      itensVO,
      pedido.cliente,
    )

    aggregate.id = pedido.id
    return aggregate
  }
}
