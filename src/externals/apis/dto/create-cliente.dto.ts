import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { cpf } from "cpf-cnpj-validator";
import { CpfValido } from "src/core/clientes/rules/cpf-valido.validator";
export class CreateClienteDto {
    @IsString()
    @ApiProperty({ example: 'João Santos', description: 'O nome do cliente'})
    readonly nome: string;

    @IsString()
    @CpfValido()
    @ApiProperty({ example: '518.207.466-23', description: 'O CPF do cliente'})
    @Transform(({ value }) => cpf.format(value))
    readonly cpf: string;

    @IsEmail()
    @ApiProperty({ example: 'joao@example.com.br', description: 'O email do cliente'})
    readonly email: string;
}
