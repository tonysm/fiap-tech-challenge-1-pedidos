import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository";
import { In, Not, Repository } from "typeorm";

@Injectable()
export class ClientesRepository implements ClientesRepositoryInterface {
    constructor(
        @InjectRepository(Cliente)
        private repository: Repository<Cliente>
    ) {}

    save(cliente: Cliente) {
        return this.repository.save(cliente);
    }

    findAll() {
        return this.repository.find()
    }

    findById(id: number) {
        return this.repository.findOneBy({ id })
    }

    findByCpf(cpf: string, except?: number[]) {
        let query = this.repository.createQueryBuilder('cliente')
            .where('cliente.cpf = :cpf', { cpf });

        if (except) {
            query = query.where({ id: Not(In(except)) })
        }

        return query.getOne()
    }

    findByEmail(email: string, except?: number[]) {
        let query = this.repository.createQueryBuilder('cliente')
            .where('cliente.email = :email', { email });

        if (except) {
            query = query.where({ id: Not(In(except)) })
        }

        return query.getOne()
    }

    delete(id: number) {
        this.repository.delete({ id });
    }
}
