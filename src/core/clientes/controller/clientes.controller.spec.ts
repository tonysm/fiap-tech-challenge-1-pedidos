import { ClientesController } from './clientes.controller';
import { ClientesService } from '../clientes.service';
import { ClientesRepositoryInterface } from '../repositories/clientes.repository';
import { ClientesRepository } from '../../../externals/repositories/clientes.repository';
import { Cliente } from '../entities/cliente.entity';
import {
  ClienteNaoEncontrado,
  DuplicidadeDeCpf,
  DuplicidadeDeEmail,
} from '../exceptions/cliente.exception';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';

describe('ClientesController', () => {
  let repository: ClientesRepositoryInterface;
  let controller: ClientesController;
  let pedidos: PedidosRepository;

  beforeEach(async () => {
    repository = new ClientesRepository(null);
    controller = new ClientesController(
      new ClientesService(repository),
      (pedidos = new PedidosRepository(null, null)),
    );
  });

  it('should create', async () => {
    const input = {
      nome: 'Jon Doe',
      cpf: '999.999.999-99',
      email: 'joao@example.com',
    };

    let savedClient = null;

    jest.spyOn(repository, 'save').mockImplementation(async (client) => {
      return (savedClient = client);
    });
    let testedCpf = null,
      testedEmail = null;

    jest.spyOn(repository, 'findByCpf').mockImplementation(async (cpf) => {
      testedCpf = cpf;
      return null;
    });

    jest.spyOn(repository, 'findByEmail').mockImplementation(async (email) => {
      testedEmail = email;
      return null;
    });

    await controller.create(input);

    expect(savedClient).toEqual(input);
    expect(testedCpf).toEqual(input.cpf);
    expect(testedEmail).toEqual(input.email);
  });

  it('finds all', async () => {
    const all = [
      Cliente.createFrom({
        nome: 'jon',
        email: 'jon@example.com',
        cpf: '999.999.999-99',
      }),
    ];

    jest
      .spyOn(repository, 'findAll')
      .mockImplementation(async () => Promise.resolve(all));

    const found = await controller.findAll();

    expect(found).toEqual(all);
  });

  it('finds one', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    let queriedId = null;

    jest.spyOn(repository, 'findById').mockImplementation(async (id) => {
      queriedId = id;
      return cliente;
    });

    let found = await controller.findOne(123);

    expect(found).toBe(cliente);
    expect(queriedId).toEqual(123);
  });

  it('find by cpf', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    let queriedCpf = null;

    jest.spyOn(repository, 'findByCpf').mockImplementation(async (cpf) => {
      queriedCpf = cpf;
      return cliente;
    });

    let found = await controller.findByCpf(cliente.cpf);

    expect(found).toBe(cliente);
    expect(queriedCpf).toEqual(cliente.cpf);
  });

  it('updates', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    let testedCpf, testedEmail, queriedId, savedClient;

    jest.spyOn(repository, 'findByCpf').mockImplementation(async (cpf) => {
      testedCpf = cpf;
      return null;
    });

    jest.spyOn(repository, 'findByEmail').mockImplementation(async (email) => {
      testedEmail = email;
      return null;
    });

    jest.spyOn(repository, 'findById').mockImplementation(async (id) => {
      queriedId = id;
      // create a copy...
      return Cliente.createFrom({ ...cliente });
    });

    jest.spyOn(repository, 'save').mockImplementation(async (cliente) => {
      return (savedClient = cliente);
    });

    let saved = await controller.update(123, {
      nome: 'jane',
      email: 'jane@example.com',
      cpf: '999.999.999-01',
    });

    expect(savedClient).not.toEqual(cliente);
    expect(saved).toEqual(savedClient);
    expect(saved.nome).toEqual('jane');
    expect(saved.email).toEqual('jane@example.com');
    expect(saved.cpf).toEqual('999.999.999-01');
    expect(testedCpf).toEqual(saved.cpf);
    expect(testedEmail).toEqual(saved.email);
  });

  it('fails when trying to update with duplicate CPF', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    jest.spyOn(repository, 'findByCpf').mockImplementation(async () => cliente);

    try {
      await controller.update(123, {
        nome: 'jane',
        email: 'jane@example.com',
        cpf: '999.999.999-99',
      });

      fail('should have failed');
    } catch (e) {
      expect(e).toBeInstanceOf(DuplicidadeDeCpf);
    }
  });

  it('fails when trying to update with duplicate email', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    jest.spyOn(repository, 'findByCpf').mockImplementation(async () => null);
    jest
      .spyOn(repository, 'findByEmail')
      .mockImplementation(async () => cliente);

    try {
      await controller.update(123, {
        nome: 'jane',
        email: 'jon@example.com',
        cpf: '999.999.999-99',
      });

      fail('should have failed');
    } catch (e) {
      expect(e).toBeInstanceOf(DuplicidadeDeEmail);
    }
  });

  it('fails when not found', async () => {
    let cliente = Cliente.createFrom({
      nome: 'jon',
      email: 'jon@example.com',
      cpf: '999.999.999-99',
    });

    jest.spyOn(repository, 'findByCpf').mockImplementation(async () => null);
    jest.spyOn(repository, 'findByEmail').mockImplementation(async () => null);
    jest.spyOn(repository, 'findById').mockImplementation(async () => null);

    try {
      await controller.update(123, {
        nome: 'jane',
        email: 'jon@example.com',
        cpf: '999.999.999-99',
      });

      fail('should have failed');
    } catch (e) {
      expect(e).toBeInstanceOf(ClienteNaoEncontrado);
    }
  });

  it('removes', async () => {
    let id = 123;

    let removedId;
    let clienteIdPedidosCancelados;

    jest.spyOn(repository, 'delete').mockImplementation(async (id) => {
      removedId = id;
    });
    jest
      .spyOn(pedidos, 'cancelarPedidosPendentes')
      .mockImplementation(async (clienteId) => {
        clienteIdPedidosCancelados = clienteId;
      });

    await controller.remove(id);

    expect(removedId).toEqual(id);
    expect(clienteIdPedidosCancelados).toEqual(id);
  });
});
