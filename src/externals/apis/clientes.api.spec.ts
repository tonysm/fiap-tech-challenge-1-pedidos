import { ClientesControllerInterface } from "src/core/clientes/controller/clientes.controller.interface"
import { ClientesAPI } from "./clientes.api"
import { ClientesController } from "src/core/clientes/controller/clientes.controller"
import { CreateClienteDto } from "./dto/create-cliente.dto"
import { Cliente } from "src/core/clientes/entities/cliente.entity"
import { HttpException } from "@nestjs/common"
import { UpdateClienteDto } from "./dto/update-cliente.dto"

describe('Clientes API', () => {
    let controller: ClientesControllerInterface
    let api: ClientesAPI

    beforeEach(() => {
        controller = new ClientesController(null, null)
        api = new ClientesAPI(controller)
    })

    it('creates', () => {
        let body = new CreateClienteDto()
        let cliente = new Cliente

        let usedData
        jest.spyOn(controller, 'create').mockImplementation((data) => {
            usedData = data
            return cliente
        })

        const found = api.create(body)

        expect(found).toBe(cliente)
        expect(usedData).toBe(body)
    })

    it('finds all', () => {
        let all = [new Cliente]

        jest.spyOn(controller, 'findAll').mockImplementation(() => all)

        const found = api.findAll()

        expect(found).toBe(all)
    })

    it('finds by cpf', async () => {
        let cliente = new Cliente
        cliente.cpf = '999.999.999-99'

        let queriedCpf
        jest.spyOn(controller, 'findByCpf').mockImplementation(async (cpf) => {
            queriedCpf = cpf
            return cliente
        })

        const found = await api.findByCpf(cliente.cpf)

        expect(found).toBe(cliente)
        expect(queriedCpf).toEqual(cliente.cpf)
    })

    it('finds by cpf throws exception when not found', async () => {
        jest.spyOn(controller, 'findByCpf').mockImplementation(async () => null)

        try {
            await api.findByCpf('999.999.999-99')
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException)
        }
    })

    it('finds by ID', async () => {
        let cliente = new Cliente
        cliente.id = 123

        let queriedId
        jest.spyOn(controller, 'findOne').mockImplementation(async (id) => {
            queriedId = id
            return cliente
        })

        const found = await api.findOne(`${cliente.id}`)

        expect(found).toBe(cliente)
        expect(queriedId).toEqual(cliente.id)
    })

    it('finds by ID and throws exception', async () => {
        jest.spyOn(controller, 'findOne').mockImplementation(async () => null)

        try {
            await api.findOne('123')
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException)
        }
    })

    it('updates', () => {
        let body = new UpdateClienteDto
        let cliente = new Cliente
        cliente.id = 123

        let usedId, usedData
        jest.spyOn(controller, 'update').mockImplementation((id, data) => {
            usedId = id
            usedData = data

            return cliente
        })

        const updated = api.update(`${cliente.id}`, body)

        expect(updated).toBe(cliente)
        expect(usedId).toEqual(cliente.id)
        expect(usedData).toEqual(body)
    })

    it('deletes', () => {
        let usedId
        jest.spyOn(controller, 'remove').mockImplementation((id) => {
            usedId = id

            return null
        })

        api.remove('123')

        expect(usedId).toEqual(123)
    })
})
