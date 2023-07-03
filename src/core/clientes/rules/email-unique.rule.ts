import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { ClientesRepositoryInterface } from "../repositories/clientes.repository";
import { Inject, Injectable } from "@nestjs/common";
import { ClientesRepository } from "src/adapter/driven/infrastructure/repositories/clientes.repository";

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailJaExisteRule implements ValidatorConstraintInterface {
  constructor (
    @Inject(ClientesRepository)
    private readonly clientes: ClientesRepositoryInterface
  ) {}

  async validate(email: string) {
    try {
      await this.clientes.findByEmailOrFail(email)
    } catch (error) {
      return true
    }

    return false
  }

  defaultMessage(): string {
    return 'Email já cadastrado'
  }
}

export function EmailJaExiste(validationOptions?: ValidationOptions) {
  return function (o: object, propertyName: string) {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailJaExisteRule,
      async: true,
    })
  }
}
