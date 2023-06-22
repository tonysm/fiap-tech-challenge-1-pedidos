import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../entities/item.entity';
import { CreatePedidoItemDto } from './create-pedido-item.dto';

export class CreatePedidoDto {
    @ApiProperty({ name: 'clienteId', example: 1, description: 'O ID do cliente (opcional)' })
    clienteId?: number;

    @ApiProperty({
        example: [
            {
                produtoId: 1,
                quantidade: 1,
                observacao: 'Sem picles'
            }
        ],
        description: 'A lista de itens do pedido',
    })
    items: CreatePedidoItemDto[];
}
