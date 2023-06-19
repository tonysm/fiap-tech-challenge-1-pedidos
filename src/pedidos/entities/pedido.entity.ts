import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Pedido {
  @ApiProperty({ example: 1, description: 'O identificador do Pedido' })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn()
  cliente?: Cliente;

  @OneToMany(() => Item, (item) => item.pedido, { eager: true })
  items: Item[];
}
