import { CreateClienteDto } from '../../adapter/driver/controllers/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/adapter/driver/controllers/dto/update-cliente.dto';

export interface ClientesServiceInterface {
  create(input: CreateClienteDto)
  findAll()
  findOne(id: number)
  findByCpf(cpf: string)
  update(id: number, { nome, cpf, email }: UpdateClienteDto)
  remove(id: number)
}

export const ClientesServiceInterface = Symbol('ClientesServiceInterface')