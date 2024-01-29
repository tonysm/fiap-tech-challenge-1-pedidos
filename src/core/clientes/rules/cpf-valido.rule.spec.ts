import { ValidatorConstraintInterface } from "class-validator";
import { describe } from "node:test";
import { CpfValidoRule } from "./cpf-valido.rule";

describe('CpfValidoRule', () => {
    let rule: ValidatorConstraintInterface;

    beforeEach(() => {
        rule = new CpfValidoRule()
    })

    it('validates CPF', () => {
        expect(rule.validate('999.999.999-81')).toBeFalsy()
        expect('CPF inválido').toEqual(rule.defaultMessage())
    })
});
