import { Inject, Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../adapter/driver/controllers/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/adapter/driver/controllers/dto/update-cliente.dto';
import { ClientesRepositoryInterface } from './repositories/clientes.repository';
import { Cliente } from './entities/cliente.entity';
import { ClienteNaoEncontrado, DuplicidadeDeCpf, DuplicidadeDeEmail } from './exceptions/cliente.exception';
import { ClientesRepository } from 'src/adapter/driven/infrastructure/repositories/clientes.repository';
import { ClientesServiceInterface } from './clientes.service.interface';

@Injectable()
export class ClientesService implements ClientesServiceInterface {
  constructor(
    @Inject(ClientesRepository)
    private repository: ClientesRepositoryInterface
  ) {}

  async create(input: CreateClienteDto) {
    await this.guardAgainstClientDuplication(input.cpf, input.email);

    return await this.repository.save(Cliente.createFrom({
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
    await this.guardAgainstClientDuplication(cpf, email, [id]);

    const cliente = await this.repository.findById(id)

    if (! cliente) {
      throw new ClienteNaoEncontrado
    }

    return this.repository.save(cliente.fill({ nome, cpf, email }))
  }

  remove(id: number) {
    this.repository.delete(id)
  }

  private async guardAgainstClientDuplication(cpf: string, email: string, except?: number[]) {
    if (await this.repository.findByCpf(cpf, except)) {
      throw new DuplicidadeDeCpf;
    }

    if (await this.repository.findByEmail(email, except)) {
      throw new DuplicidadeDeEmail;
    }
  }
}
