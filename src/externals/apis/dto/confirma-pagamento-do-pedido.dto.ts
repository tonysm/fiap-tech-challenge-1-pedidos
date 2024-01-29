import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export enum ResultadoPagamento {
    SUCESSO = 'SUCESSO',
    FALHA = 'FALHA',
}

export class ConfirmaPagamentoDoPedidoDto {
  @IsString()
  @ApiProperty({ example: ResultadoPagamento.SUCESSO, description: 'Resultado do pagamento', enum: ResultadoPagamento })
  readonly resultadoPagamento: ResultadoPagamento;
}
