import { ValidationOptions, registerDecorator } from "class-validator"
import { CpfValidoRule } from "./cpf-valido.rule"

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
