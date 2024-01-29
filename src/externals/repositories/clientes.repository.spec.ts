import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository"
import { In, Not, Repository, SelectQueryBuilder } from "typeorm"
import { ClientesRepository } from "./clientes.repository";

describe('ClientesRepository', () => {
    let orm: Repository<Cliente>;
    let repository: ClientesRepositoryInterface

    beforeEach(() => {
        orm = new Repository(Cliente, null, null)
        repository = new ClientesRepository(orm)
    })

    it('saves', async () => {
        let savedCliente
        jest.spyOn(orm, 'save').mockImplementation(async (cliente) => savedCliente = cliente as Cliente)

        let cliente = new Cliente()
        await repository.save(cliente)

        expect(savedCliente).toBe(cliente)
    })

    it('find all', async () => {
        let all = [new Cliente]
        jest.spyOn(orm, 'find').mockImplementation(async () => all)

        let found = await repository.findAll()

        expect(found).toBe(all)
    })

    it('finds by ID', async () => {
        let cliente = new Cliente
        cliente.id = 123

        let usedCriteria
        jest.spyOn(orm, 'findOneBy').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return cliente
        })

        let found = await repository.findById(cliente.id)

        expect(usedCriteria).toEqual({ id: cliente.id })
        expect(found).toBe(cliente)
    })

    it('finds by CPF', async () => {
        let cliente = new Cliente
        cliente.id = 123
        cliente.cpf = '999.999.999-99'

        let query = {
            table: null,
            clause: null,
            bindings: null,
            withTable(table) {
                this.table = table

                return this
            },
            where(clause, bindings) {
                this.clause = clause
                this.bindings = bindings

                return this
            },
            getOne() {
                return cliente
            }
        }

        jest.spyOn(orm, 'createQueryBuilder').mockImplementation((table) => query.withTable(table) as SelectQueryBuilder<Cliente>)

        const found = await repository.findByCpf(cliente.cpf)

        expect(found).toBe(cliente)
        expect(query.table).toEqual('cliente')
        expect(query.clause).toEqual('cliente.cpf = :cpf')
        expect(query.bindings).toEqual({ cpf: cliente.cpf })
    })

    it('finds by CPF with exception', async () => {
        let cliente = new Cliente
        cliente.id = 123
        cliente.cpf = '999.999.999-99'

        let query = {
            table: null,
            wheres: [],
            withTable(table) {
                this.table = table

                return this
            },
            where(...clause) {
                this.wheres.push(clause)

                return this
            },
            getOne() {
                return cliente
            }
        }

        jest.spyOn(orm, 'createQueryBuilder').mockImplementation((table) => query.withTable(table) as SelectQueryBuilder<Cliente>)

        const found = await repository.findByCpf(cliente.cpf, [321])

        expect(found).toBe(cliente)
        expect(query.table).toEqual('cliente')
        expect(query.wheres.length).toEqual(2)
        expect(query.wheres[0][0]).toEqual('cliente.cpf = :cpf')
        expect(query.wheres[0][1]).toEqual({ cpf: cliente.cpf })
        expect(query.wheres[1][0]).toEqual({ id: Not(In([321])) })
    })

    it('finds by email', async () => {
        let cliente = new Cliente
        cliente.id = 123
        cliente.email = 'jon@example.com'

        let query = {
            table: null,
            clause: null,
            bindings: null,
            withTable(table) {
                this.table = table

                return this
            },
            where(clause, bindings) {
                this.clause = clause
                this.bindings = bindings

                return this
            },
            getOne() {
                return cliente
            }
        }

        jest.spyOn(orm, 'createQueryBuilder').mockImplementation((table) => query.withTable(table) as SelectQueryBuilder<Cliente>)

        const found = await repository.findByEmail(cliente.email)

        expect(found).toBe(cliente)
        expect(query.table).toEqual('cliente')
        expect(query.clause).toEqual('cliente.email = :email')
        expect(query.bindings).toEqual({ email: cliente.email })
    })

    it('finds by email with exception', async () => {
        let cliente = new Cliente
        cliente.id = 123
        cliente.email = 'jon@example.com'

        let query = {
            table: null,
            wheres: [],
            withTable(table) {
                this.table = table

                return this
            },
            where(...clause) {
                this.wheres.push(clause)

                return this
            },
            getOne() {
                return cliente
            }
        }

        jest.spyOn(orm, 'createQueryBuilder').mockImplementation((table) => query.withTable(table) as SelectQueryBuilder<Cliente>)

        const found = await repository.findByEmail(cliente.email, [321])

        expect(found).toBe(cliente)
        expect(query.table).toEqual('cliente')
        expect(query.wheres.length).toEqual(2)
        expect(query.wheres[0][0]).toEqual('cliente.email = :email')
        expect(query.wheres[0][1]).toEqual({ email: cliente.email })
        expect(query.wheres[1][0]).toEqual({ id: Not(In([321])) })
    })

    it('deletes', async () => {
        let cliente = new Cliente
        cliente.id = 123

        let usedDeleteCriteria
        jest.spyOn(orm, 'delete').mockImplementation(async (criteria) => {
            usedDeleteCriteria = criteria
            return null
        })

        await repository.delete(cliente.id)

        expect(usedDeleteCriteria).toEqual({ id: cliente.id })
    })
})
