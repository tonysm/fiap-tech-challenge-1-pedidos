import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {
    @ApiProperty({ example: 1, description: 'O identificador do Cliente' })
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @ApiProperty({ example: 'João Santos', description: 'O nome to cliente'})
    @Column()
    nome: String;

    @IsString()
    @Column({ unique: true })
    @ApiProperty({ example: '999.999.999-99', description: 'O CPF do cliente'})
    cpf: String;

    @IsString()
    @Column({ unique: true })
    @ApiProperty({ example: 'joao@example.com.br', description: 'O email do cliente'})
    email: String;

    static createFrom({ nome, cpf, email }: { nome: String, cpf: String, email: String }) {
        const cliente = new Cliente();

        cliente.fill({ nome, cpf, email })

        return cliente;
    }

    fill({ nome, cpf, email }: { nome: String, cpf: String, email: String }) {
        this.nome = nome
        this.cpf = cpf
        this.email = email

        return this
    }
}
