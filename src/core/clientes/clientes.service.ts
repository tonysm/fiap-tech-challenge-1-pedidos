import { Inject, Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../adapter/driver/controllers/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/adapter/driver/controllers/dto/update-cliente.dto';
import { ClientesRepositoryInterface } from './repositories/clientes.repository';
import { Cliente } from './entities/cliente.entity';
import { ClienteNaoEncontrado } from './exceptions/cliente.exception';
import { ClientesRepository } from 'src/adapter/driven/infrastructure/repositories/clientes.repository';

@Injectable()
export class ClientesService {
  constructor(
    @Inject(ClientesRepository)
    private repository: ClientesRepositoryInterface
  ) {}

  create(input: CreateClienteDto) {
    return this.repository.save(Cliente.createFrom({
        nome: input.nome,
        cpf: input.cpf,
        email: input.email,
    }));
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findById(id)
  }

  findByCpf(cpf: string) {
    return this.repository.findByCpf(cpf)
  }

  async update(id: number, { nome, cpf, email }: UpdateClienteDto) {
    const cliente = await this.repository.findById(id)

    if (! cliente) {
        throw new ClienteNaoEncontrado
    }

    return this.repository.save(cliente.fill({ nome, cpf, email }))
  }

  remove(id: number) {
    this.repository.delete(id)
  }
}
