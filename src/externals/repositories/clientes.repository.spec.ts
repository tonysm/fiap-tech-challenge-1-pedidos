import { Cliente } from 'src/core/clientes/entities/cliente.entity';
import { ClientesRepositoryInterface } from 'src/core/clientes/repositories/clientes.repository';
import { DataSource, In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ClientesRepository } from './clientes.repository';

describe('ClientesRepository', () => {
  let orm: Repository<Cliente>;
  let repository: ClientesRepositoryInterface;
  let dataSource: DataSource;

  beforeEach(() => {
    orm = new Repository(Cliente, null, null);
    repository = new ClientesRepository(orm);
    dataSource = new DataSource({ type: 'sqlite', database: ':memory:' });
  });

  it('saves', async () => {
    let savedCliente;
    const cliente = new Cliente();

    jest.spyOn(orm, 'save').mockImplementation(async (givenCliente) => {
      savedCliente = givenCliente;
      return Promise.resolve(cliente);
    });

    await repository.save(cliente);

    expect(savedCliente).toBe(cliente);
  });

  it('find all', async () => {
    const all = [new Cliente()];
    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;

    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getMany')
      .mockImplementation(async () => Promise.resolve(all));

    const found = await repository.findAll();

    expect(found).toBe(all);
    expect(usedWhere).toEqual({ deletado: false });
  });

  it('finds by ID', async () => {
    const cliente = new Cliente();
    cliente.id = 123;

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));

    const found = await repository.findById(cliente.id);

    expect(found).toBe(cliente);
    expect(usedWhere).toEqual({
      deletado: false,
      id: cliente.id,
    });
  });

  it('finds by CPF', async () => {
    const cliente = new Cliente();
    cliente.id = 123;
    cliente.cpf = '999.999.999-99';

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));

    const found = await repository.findByCpf(cliente.cpf);

    expect(found).toBe(cliente);
    expect(usedWhere).toEqual({
      deletado: false,
      cpf: cliente.cpf,
    });
  });

  it('finds by CPF with exceptions', async () => {
    const cliente = new Cliente();
    cliente.id = 123;
    cliente.cpf = '999.999.999-99';

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));

    const except = [432];
    const found = await repository.findByCpf(cliente.cpf, except);

    expect(found).toBe(cliente);
    expect(usedWhere).toEqual({
      deletado: false,
      cpf: cliente.cpf,
      id: Not(In(except)),
    });
  });

  it('finds by email', async () => {
    const cliente = new Cliente();
    cliente.id = 123;
    cliente.email = 'jon@example.com';

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));

    const found = await repository.findByEmail(cliente.email);

    expect(found).toBe(cliente);
    expect(usedWhere).toEqual({
      deletado: false,
      email: cliente.email,
    });
  });

  it('finds by email with exceptions', async () => {
    const cliente = new Cliente();
    cliente.id = 123;
    cliente.email = 'jon@example.com';

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));

    const except = [432];
    const found = await repository.findByEmail(cliente.email, except);

    expect(found).toBe(cliente);
    expect(usedWhere).toEqual({
      deletado: false,
      email: cliente.email,
      id: Not(In(except)),
    });
  });

  it('deletes by obfuscating', async () => {
    let cliente = new Cliente(),
        nome = "original nome",
        email = "original@example.com";
    cliente.id = 123;
    cliente.nome = nome;
    cliente.email = email;
    cliente.cpf = "999.999.999-99";

    const builder = new SelectQueryBuilder<Cliente>(dataSource, null);

    let usedWhere, deleted;
    jest.spyOn(orm, 'createQueryBuilder').mockImplementation(() => builder);
    jest.spyOn(builder, 'where').mockImplementation((where) => {
      usedWhere = where;
      return builder;
    });
    jest
      .spyOn(builder, 'getOne')
      .mockImplementation(async () => Promise.resolve(cliente));
    jest
      .spyOn(repository, 'save')
      .mockImplementation(async (updated) => {
        deleted = updated;
        return Promise.resolve(updated);
      });

    await repository.delete(cliente.id);

    expect(usedWhere).toEqual({
      deletado: false,
      id: cliente.id,
    });
    expect(deleted.id).toEqual(cliente.id);
    expect(deleted.nome).not.toEqual(nome);
    expect(deleted.email).not.toEqual(email);
    expect(deleted.cpf).toBeNull();
  });
});
