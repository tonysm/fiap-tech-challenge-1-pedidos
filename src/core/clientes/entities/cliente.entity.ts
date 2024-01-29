import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cliente {
  @ApiProperty({ example: 1, description: 'O identificador do Cliente' })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @ApiProperty({ example: 'João Santos', description: 'O nome to cliente' })
  @Column()
  nome: string;

  @IsString()
  @Column({ unique: true })
  @ApiProperty({ example: '999.999.999-99', description: 'O CPF do cliente' })
  cpf: string;

  @IsString()
  @Column({ unique: true })
  @ApiProperty({
    example: 'joao@example.com.br',
    description: 'O email do cliente',
  })
  email: string;

  static createFrom({
    nome,
    cpf,
    email,
  }: {
    nome: string;
    cpf: string;
    email: string;
  }) {
    const cliente = new Cliente();

    cliente.fill({ nome, cpf, email });

    return cliente;
  }

  fill({ nome, cpf, email }: { nome: string; cpf: string; email: string }) {
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;

    return this;
  }
}
