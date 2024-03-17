import { CreateClienteDto } from '../../../externals/apis/dto/create-cliente.dto';
import { UpdateClienteDto } from 'src/externals/apis/dto/update-cliente.dto';
import { Cliente } from '../entities/cliente.entity';

export interface ClientesControllerInterface {
  create(input: CreateClienteDto): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findOne(id: number): Promise<Cliente | null>;
  findByCpf(cpf: string): Promise<Cliente | null>;
  update(id: number, { nome, cpf, email }: UpdateClienteDto): Promise<Cliente>;
  remove(id: number): void;
}

export const ClientesControllerInterface = Symbol(
  'ClientesControllerInterface',
);
