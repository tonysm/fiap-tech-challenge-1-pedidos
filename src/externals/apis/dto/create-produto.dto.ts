import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Categoria } from "../../../core/produtos/entities/produto.entity";

export class CreateProdutoDto {
    @IsString()
    @ApiProperty({ example: 'X-Burger', description: 'O nome do produto'})
    readonly nome: String;

    @IsString()
    @ApiProperty({ example: Categoria.LANCHE, description: 'A categoria do produto', enum: Categoria })
    readonly categoria: Categoria;

    @IsString()
    @ApiProperty({ example: 'Pão de batata, molho de tomate, queijo mussarela, finíssimas fatias de cebola, ovo, azeitonas verde, milho verde e rodelas de linguiça calabresa defumada', description: 'A descrição do produto'})
    readonly descricao: String;

    @IsNumber()
    @ApiProperty({ example: '9.99', description: 'O preço unitário do produto'})
    readonly precoUnitario: number
}
