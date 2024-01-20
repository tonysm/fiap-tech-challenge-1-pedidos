import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { ItemVO } from './vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';

export interface PedidosServiceInterface {
  findAll();
  findOne(id: number);
  create(input: CreatePedidoDto);
  addItem(id: number, item: ItemVO);
  updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto);
  findOneItem(id: number);
  removeItem(pedidoId: number, id: number);
}
export const PedidosServiceInterface = Symbol('PedidosServiceInterface');
