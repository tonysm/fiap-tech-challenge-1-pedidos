import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { Injectable } from "@nestjs/common";
import { cpf } from "cpf-cnpj-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class CpfValidoRule implements ValidatorConstraintInterface {
  validate(value: string) {
    return cpf.isValid(value.replace('.', '').replace('-', ''))
  }

  defaultMessage(): string {
    return 'CPF inválido'
  }
}

export function CpfValido(validationOptions?: ValidationOptions) {
  return function (o: object, propertyName: string) {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CpfValidoRule,
      async: true,
    })
  }
}
