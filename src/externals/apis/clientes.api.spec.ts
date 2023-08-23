import { Test, TestingModule } from '@nestjs/testing';
import { ClientesAPI } from './clientes.api';
import { ClientesService } from 'src/core/clientes/clientes.service';

describe('ClientesController', () => {
  let controller: ClientesAPI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesAPI],
      providers: [ClientesService],
    }).compile();

    controller = module.get<ClientesAPI>(ClientesAPI);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
