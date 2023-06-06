import { IsInt } from 'class-validator';

export class CreatePedidoDto {
    @IsInt()
    readonly id: Number;
}
