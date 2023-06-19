import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Item } from '../entities/item.entity';

export class CreatePedidoDto {
    @ApiProperty({ name: 'clienteId', example: 1, description: 'O ID do cliente (opcional)' })
    cliente?: Cliente;

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
    items: Item[];
}
