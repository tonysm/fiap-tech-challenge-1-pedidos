import { ApiProperty } from '@nestjs/swagger';

export class UpdatePedidoItemDto {
    @ApiProperty({ name: 'quantidade', example: 2, description: 'A quantidade do item selecionado' })
    quantidade: number;

    @ApiProperty({ name: 'observacao', example: 'Sem picles', description: 'Observação do item do pedido' })
    observacao: string;
}
