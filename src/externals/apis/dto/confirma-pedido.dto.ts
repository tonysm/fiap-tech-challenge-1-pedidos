import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { StatusPagamento } from "src/core/pedidos/entities/pedido.entity";

export class ConfirmaPedidoDto {
  @IsString()
  @ApiProperty({ example: StatusPagamento.SUCESSO, description: 'A categoria do produto', enum: StatusPagamento })
  readonly statusPagamento: StatusPagamento;
}
