import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientsRepository: Repository<Cliente>
  ) {}

  create(input: CreateClienteDto) {
    return this.clientsRepository.save(input);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  async findOne(id: number) {
    return await this.clientsRepository.findOneBy({ id: id })
  }

  update(id: number, input: UpdateClienteDto) {
    this.clientsRepository.update({ id }, input)
  }

  remove(id: number) {
    this.clientsRepository.delete({ id })
  }
}
