import { ApiProperty } from "@nestjs/swagger";


export class CreatePedidoItemDto {
    @ApiProperty({ name: 'produtoId', example: 1, description: 'O ID do produto' })
    produtoId: number;

    @ApiProperty({ name: 'quantidade', example: 1, description: 'A quantidade do item selecionado' })
    quantidade: number;

    @ApiProperty({ name: 'observacao', example: 1, description: 'Observação do item do pedido' })
    observacao: string;
}
