import { Cliente } from "../entities/cliente.entity";

export interface ClientesRepositoryInterface {
   save(cliente: Cliente): Promise<Cliente>;

   findAll(): Promise<Cliente[]>;

   findById(id: number): Promise<Cliente>;

   findByCpf(cpf: String): Promise<Cliente>;
   findByCpfOrFail(cpf: string): Promise<Cliente>;
   findByEmailOrFail(email: string): Promise<Cliente>;

   delete(id: number): void;
}

export const ClientesRepositoryInterface = Symbol('ClientesRepositoryInterface')
