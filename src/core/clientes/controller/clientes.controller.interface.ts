import { CreateClienteDto } from '../../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';

export interface ClientesControllerInterface {
  create(input: CreateClienteDto)
  findAll()
  findOne(id: number)
  findByCpf(cpf: string)
  update(id: number, { nome, cpf, email }: UpdateClienteDto)
  remove(id: number)
}

export const ClientesControllerInterface = Symbol('ClientesControllerInterface')
