import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository";
import { Repository } from "typeorm";

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

    findByCpf(cpf: String) {
        return this.repository.createQueryBuilder('cliente')
            .where('cliente.cpf = :cpf', { cpf })
            .getOne()
    }

    findByCpfOrFail(cpf: string) {
        return this.repository.createQueryBuilder('cliente')
            .where('cliente.cpf = :cpf', { cpf })
            .getOneOrFail()
    }

    delete(id: number) {
        this.repository.delete({ id });
    }
}
