import { CreatePedidoDto } from "src/externals/apis/dto/create-pedido.dto"
import { ItemVO } from "./vo/item.vo"
import { UpdatePedidoItemDto } from "src/externals/apis/dto/update-pedido-item.dto"
import { PagamentoGateway } from "../pagamentos/pagamento.gateway"
import { Status } from "./entities/pedido.entity"
import { Injectable } from "@nestjs/common"
import { ConfirmaPedidoDto } from "src/externals/apis/dto/confirma-pedido.dto"

export interface PedidosServiceInterface {
    findAll()
    findAllParaCozinha()
    findOne(id: number)
    create(input: CreatePedidoDto)
    addItem(id: number, item: ItemVO)
    updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto)
    findOneItem(id: number)
    removeItem(pedidoId: number, id: number)
    confirmaPagamento(pedidoId: number, input: ConfirmaPedidoDto)
    checkout(pedidoId: number, pagamentos: PagamentoGateway)
    atualizaStatusDoPedido(id: number, status: Status)
    statusPagamento(pedidoId: number)
}
export const PedidosServiceInterface = Symbol('PedidosServiceInterface')
