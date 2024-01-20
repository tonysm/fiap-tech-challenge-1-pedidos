import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/core/clientes/entities/cliente.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';

export enum Status {
  CRIANDO = 'CRIANDO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  FINALIZADO = 'FINALIZADO',
}

export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  SUCESSO = 'SUCESSO',
  FALHOU = 'FALHOU',
}

@Entity()
export class Pedido {
  @ApiProperty({ example: 1, description: 'O identificador do Pedido' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn()
  cliente?: Cliente;

  @ApiProperty({ description: 'Itens do pedido', type: Item })
  @OneToMany(() => Item, (item) => item.pedido, { eager: true, cascade: true })
  itens: Item[];

  @Column({ type: 'enum', enum: Status })
  @ApiProperty({
    example: Status.EM_PREPARACAO,
    description: 'O status atual do produto',
    enum: Status,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: StatusPagamento,
    default: StatusPagamento.PENDENTE,
  })
  @ApiProperty({
    example: StatusPagamento.PENDENTE,
    description: 'O status do pagamento do pedido',
    enum: StatusPagamento,
  })
  statusPagamento: StatusPagamento;

  @Column({ type: 'timestamp', nullable: true })
  dataConfirmacaoPagamento: Date;
}
