import { CreateClienteDto } from '../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';

export interface ClientesServiceInterface {
  create(input: CreateClienteDto);
  findAll();
  findOne(id: number);
  findByCpf(cpf: string);
  update(id: number, { nome, cpf, email }: UpdateClienteDto);
  remove(id: number);
  isActive(id: number): Promise<boolean>;
}

export const ClientesServiceInterface = Symbol('ClientesServiceInterface');
