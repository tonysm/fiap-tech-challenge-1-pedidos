import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Categoria } from "../entities/produto.entity";
import { Expose } from "class-transformer";

export class ListProdutoDto {
    @IsOptional()
    @Expose()
    @IsEnum(Categoria)
    @ApiPropertyOptional({ example: Categoria.LANCHE, description: 'A categoria do produto', enum: Categoria })
    readonly categoria: Categoria;
}
