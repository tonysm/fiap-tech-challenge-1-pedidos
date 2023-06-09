import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pedido {
  @ApiProperty({ example: 1, description: 'O identificador do Pedido' })
  @PrimaryGeneratedColumn()
  id: number;
}
