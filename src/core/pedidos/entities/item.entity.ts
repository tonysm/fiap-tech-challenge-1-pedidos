import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { Produto } from 'src/core/produtos/entities/produto.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'O ID do item to pedido' })
  id: number;

  @ManyToOne(/* istanbul ignore next */ () => Pedido, /* istanbul ignore next */ (pedido) => pedido.itens, { nullable: false })
  @JoinColumn()
  pedido: Pedido;

  @ManyToOne(/* istanbul ignore next */ () => Produto, { nullable: false, eager: true })
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

  @IsNumber()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoUnitario: number;
}
