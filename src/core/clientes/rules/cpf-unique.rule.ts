import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { ClientesRepositoryInterface } from "../repositories/clientes.repository";
import { Inject, Injectable } from "@nestjs/common";
import { ClientesRepository } from "src/adapter/driven/infrastructure/repositories/clientes.repository";

@Injectable()
@ValidatorConstraint({ async: true })
export class CpfJaExisteRule implements ValidatorConstraintInterface {
  constructor (
    @Inject(ClientesRepository)
    private readonly clientes: ClientesRepositoryInterface
  ) {}

  async validate(cpf: string) {
    try {
      await this.clientes.findByCpfOrFail(cpf)
    } catch (error) {
      return true
    }

    return false
  }

  defaultMessage(): string {
    return 'CPF já cadastrado'
  }
}

export function CpfJaExiste(validationOptions?: ValidationOptions) {
  return function (o: object, propertyName: string) {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CpfJaExisteRule,
      async: true,
    })
  }
}
