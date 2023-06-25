import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ItemVO } from "../vo/item.vo";
import { CreatePedidoDto } from "src/adapter/driver/controllers/dto/create-pedido.dto";
import { PedidoAggregate } from "./pedido.aggregate";
import { Inject, Injectable } from "@nestjs/common";
import { ProdutosRepository } from "src/adapter/driven/infrastructure/repositories/produtos.repository";
import { ClientesRepository } from "src/adapter/driven/infrastructure/repositories/clientes.repository";
import { ProdutosRepositoryInterface } from "src/core/produtos/repositories/produtos.repository";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository";
import { ProdutoNaoEncontrado } from "src/core/produtos/exceptions/produto.exception";
import { Repository } from "typeorm";
import { Pedido, Status } from "../entities/pedido.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PedidoNaoEncontrado } from "../exceptions/pedido.exception";

@Injectable()
export class PedidoAggregateFactory {

    constructor(
        @Inject(ProdutosRepository)
        private produtosRepository: ProdutosRepositoryInterface,
        @Inject(ClientesRepository)
        private clientesRepository: ClientesRepositoryInterface,
        @InjectRepository(Pedido)
        private pedidoRepository: Repository<Pedido>
    ) { }

    async createNew(input: CreatePedidoDto): Promise<PedidoAggregate> {
        let cliente: Cliente = null

        if (input.clienteId) {
            cliente = await this.clientesRepository.findById(input.clienteId)
        }

        return new PedidoAggregate(
            Status.CRIANDO,
            [],
            cliente
        )
    }


    async createFromId(pedidoId: number): Promise<PedidoAggregate> {
        const pedido = await this.pedidoRepository.findOneBy({ id: pedidoId })

        if(! pedido) {
            throw new PedidoNaoEncontrado
        }

        const itemsVO = pedido.items.map(element => {
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
            itemsVO,
            pedido.cliente
        )

        aggregate.id = pedido.id
        return aggregate
    }



}
