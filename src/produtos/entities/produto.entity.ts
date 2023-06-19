import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Categoria {
    LANCHE = 'lanche',
    ACOMPANHAMENTO = 'acompanhamento',
    BEBIDA = 'bebida',
    SOBREMESA = 'sobremesa',
}

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID do produto' })
    id: number;

    @Column()
    @ApiProperty({ example: 'Sanduíche', description: 'Nome do produto' })
    nome: String;

    @Column({ type: 'enum', enum: Categoria })
    @ApiProperty({ example: Categoria.LANCHE, description: 'A categoria do produto', enum: Categoria })
    categoria: Categoria;

    @Column()
    @ApiProperty({ example: 'Pão de batata, molho de tomate, queijo mussarela, finíssimas fatias de cebola, ovo, azeitonas verde, milho verde e rodelas de linguiça calabresa defumada', description: 'A descrição do produto'})
    descricao: String;
}
