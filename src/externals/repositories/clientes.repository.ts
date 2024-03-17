import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/core/clientes/entities/cliente.entity';
import { ClientesRepositoryInterface } from 'src/core/clientes/repositories/clientes.repository';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class ClientesRepository implements ClientesRepositoryInterface {
  constructor(
    @InjectRepository(Cliente)
    private repository: Repository<Cliente>,
  ) {}

  save(cliente: Cliente) {
    return this.repository.save(cliente);
  }

  findAll() {
    return this.ativos().getMany();
  }

  findById(id: number) {
    return this.ativos({ id }).getOne();
  }

  findByCpf(cpf: string, except?: number[]) {
    return this.ativos({
      cpf,
      ...(except ? { id: Not(In(except)) } : {}),
    }).getOne();
  }

  findByEmail(email: string, except?: number[]) {
    return this.ativos({
      email,
      ...(except ? { id: Not(In(except)) } : {}),
    }).getOne();
  }

  async delete(id: number) {
    const cliente = await this.findById(id);

    if (!cliente) {
      return;
    }

    await this.save(cliente.desativar());
  }

  async isActive(id: number): Promise<boolean> {
    return this.ativos({ id }).getExists();
  }

  private ativos(where = {}) {
    return this.repository
      .createQueryBuilder('cliente')
      .where({ deletado: false, ...where });
  }
}
