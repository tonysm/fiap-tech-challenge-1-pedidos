import { ApiProperty } from '@nestjs/swagger';

export class CreatePedidoDto {
    @ApiProperty({ name: 'clienteId', example: 1, description: 'O ID do cliente (opcional)' })
    clienteId?: number;
}
