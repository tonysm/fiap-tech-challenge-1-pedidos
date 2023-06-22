import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/core/clientes/entities/cliente.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

export enum Status {
  RECEBIDO = 'RECEBIDO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  PRONTO = 'PRONTO',
  FINALIZADO = 'FINALIZADO'
}

@Entity()
export class Pedido {
  @ApiProperty({ example: 1, description: 'O identificador do Pedido' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn()
  cliente?: Cliente;

  @ApiProperty({description: 'Itens do pedido', type: Item })
  @OneToMany(() => Item, (item) => item.pedido, { eager: true, cascade: true })
  items: Item[];

  @Column({ type: 'enum', enum: Status })
  @ApiProperty({ example: Status.EM_PREPARACAO, description: 'O status atual do produto', enum: Status })
  status: Status;
}
