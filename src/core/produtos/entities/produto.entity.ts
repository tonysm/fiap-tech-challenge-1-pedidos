import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
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

    @IsNumber()
    @Column({type: "decimal", precision: 10, scale: 2})
    precoUnitario: number;


    static createFrom({ nome, categoria, descricao, precoUnitario }: { nome: String, categoria: Categoria, descricao: String, precoUnitario: number }) {
        const produto = new Produto();

        produto.fill({ nome, categoria, descricao, precoUnitario })

        return produto;
    }

    fill({ nome, categoria, descricao, precoUnitario }: { nome: String, categoria: Categoria, descricao: String, precoUnitario: number }) {
        this.nome = nome
        this.categoria = categoria
        this.descricao = descricao
        this.precoUnitario = precoUnitario

        return this
    }
}
