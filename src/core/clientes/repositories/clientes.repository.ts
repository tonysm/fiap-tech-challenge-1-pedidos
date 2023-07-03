import { Cliente } from "../entities/cliente.entity";

export interface ClientesRepositoryInterface {
   save(cliente: Cliente): Promise<Cliente>;

   findAll(): Promise<Cliente[]>;

   findById(id: number): Promise<Cliente>;

   findByCpf(cpf: string, except?: number[]): Promise<Cliente>;
   findByEmail(email: string, except?: number[]): Promise<Cliente>;

   delete(id: number): void;
}

export const ClientesRepositoryInterface = Symbol('ClientesRepositoryInterface')
