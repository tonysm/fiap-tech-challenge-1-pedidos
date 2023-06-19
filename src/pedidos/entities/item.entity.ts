import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido.entity";
import { IsInt, IsString, Max, Min } from "class-validator";
import { Produto } from "src/produtos/entities/produto.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'O ID do item to pedido' })
    id: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.items, { nullable: false })
    @JoinColumn()
    pedido: Pedido;

    @OneToOne(() => Produto, {nullable: false, eager: true})
    @JoinColumn()
    produto: Produto;

    @IsInt()
    @Column()
    @Max(100)
    @Min(1)
    quantidade: number;

    @IsString()
    @Column({ nullable: true })
    observacao: string;
}
