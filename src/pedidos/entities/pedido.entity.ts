import { ApiProperty } from '@nestjs/swagger';

export class Pedido {
  @ApiProperty({ example: 1, description: 'O identificador do Pedido' })
  id: number;
}
