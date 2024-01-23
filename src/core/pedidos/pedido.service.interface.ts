import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { ItemVO } from './vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PagamentosServiceInterface } from './services/pagamentos.service.interface';
import { ProducaoServiceInterface } from './services/producao.service.interface';

export interface PedidosServiceInterface {
  findAll();
  findOne(id: number);
  create(input: CreatePedidoDto);
  addItem(id: number, item: ItemVO);
  updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto);
  findOneItem(id: number);
  removeItem(pedidoId: number, id: number);
  solicitarPagamento(pedidoId: number, gatewayPagamento: PagamentosServiceInterface);
  confirmarPagamento(pedidoId: number, pagoComSucesso: boolean, gatewayProducao: ProducaoServiceInterface);
  finalizar(pedidoId: number);
}

export const PedidosServiceInterface = Symbol('PedidosServiceInterface');
