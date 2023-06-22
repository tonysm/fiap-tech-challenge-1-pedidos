import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Status } from "src/core/pedidos/entities/pedido.entity";

export class UpdateEtapaPedido {
    @IsEnum(Status)
    @ApiProperty({ type: 'enum', enum: Status, description: 'A etapa que o pedido será movido' })
    status: Status;
}
