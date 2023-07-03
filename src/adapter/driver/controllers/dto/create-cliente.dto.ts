import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { cpf } from "cpf-cnpj-validator";
import { CpfJaExiste } from "src/core/clientes/rules/cpf-unique.rule";
import { CpfValido } from "src/core/clientes/rules/cpf-valido.rule";
import { EmailJaExiste } from "src/core/clientes/rules/email-unique.rule";

export class CreateClienteDto {
    @IsString()
    @ApiProperty({ example: 'João Santos', description: 'O nome do cliente'})
    readonly nome: String;

    @IsString()
    @CpfJaExiste()
    @CpfValido()
    @ApiProperty({ example: '999.999.999-99', description: 'O CPF do cliente'})
    @Transform(({ value }) => cpf.format(value))
    readonly cpf: String;

    @IsEmail()
    @EmailJaExiste()
    @ApiProperty({ example: 'joao@example.com.br', description: 'O email do cliente'})
    readonly email: String;
}
