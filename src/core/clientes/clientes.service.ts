import { Inject, Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';
import { ClientesRepositoryInterface } from './repositories/clientes.repository';
import { Cliente } from './entities/cliente.entity';
import * as ClienteException from './exceptions/cliente.exception';
import { ClientesRepository } from 'src/externals/repositories/clientes.repository';
import { ClientesServiceInterface } from './clientes.service.interface';

@Injectable()
export class ClientesService implements ClientesServiceInterface {
  constructor(
    @Inject(ClientesRepository)
    private repository: ClientesRepositoryInterface,
  ) {}

  async create(input: CreateClienteDto) {
    await this.guardAgainstClientDuplication(input.cpf, input.email);

    return this.save(
      Cliente.createFrom({
        nome: input.nome,
        cpf: input.cpf,
        email: input.email,
      }),
    );
  }

  save(cliente: Cliente) {
    return this.repository.save(cliente);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findById(id);
  }

  findByCpf(cpf: string) {
    return this.repository.findByCpf(cpf);
  }

  async update(id: number, { nome, cpf, email }: UpdateClienteDto) {
    await this.guardAgainstClientDuplication(cpf, email, [id]);

    const cliente = await this.repository.findById(id);

    if (!cliente) {
      throw new ClienteException.ClienteNaoEncontrado();
    }

    return this.save(cliente.fill({ nome, cpf, email }));
  }

  remove(id: number) {
    this.repository.delete(id);
  }

  isActive(id: number): Promise<boolean> {
    return this.repository.isActive(id);
  }

  private async guardAgainstClientDuplication(
    cpf: string,
    email: string,
    except?: number[],
  ) {
    if (await this.repository.findByCpf(cpf, except)) {
      throw new ClienteException.DuplicidadeDeCpf();
    }

    if (await this.repository.findByEmail(email, except)) {
      throw new ClienteException.DuplicidadeDeEmail();
    }
  }
}
