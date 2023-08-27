import { Inject, Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';
import { ClientesRepositoryInterface } from './../repositories/clientes.repository';
import { Cliente } from './../entities/cliente.entity';
import { ClienteNaoEncontrado, DuplicidadeDeCpf, DuplicidadeDeEmail } from './../exceptions/cliente.exception';
import { ClientesRepository } from 'src/externals/repositories/clientes.repository';
import { ClientesControllerInterface } from './clientes.controller.interface';
import { ClientesServiceInterface } from '../clientes.service.interface';
import { ClientesService } from '../clientes.service';
import { cp } from 'fs';

@Injectable()
export class ClientesController implements ClientesControllerInterface {
  constructor(
    @Inject(ClientesService)
    private clientesService: ClientesServiceInterface,
    @Inject(ClientesRepository)
    private repository: ClientesRepositoryInterface
  ) {}

  async create(input: CreateClienteDto) {
    const clienteCriado = await this.clientesService.create(input)
    this.repository.save(clienteCriado)
  }

  findAll() {
    return this.clientesService.findAll()
  }

  async findOne(id: number) {
    return await this.clientesService.findOne(id)
  }

  findByCpf(cpf: string) {
    return this.clientesService.findByCpf(cpf)
  }

  async update(id: number, input: UpdateClienteDto) {
    const clienteAtualizado = await this.clientesService.update(id, input)
    return this.repository.save(clienteAtualizado)
  }

  remove(id: number) {
    this.clientesService.remove(id)
  }
}
