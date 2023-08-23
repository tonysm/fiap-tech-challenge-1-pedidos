import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosAPI } from './produtos.api';
import { ProdutosService } from 'src/core/produtos/produtos.service';
import { ProdutosController } from 'src/core/produtos/controller/produtos.controller';

describe('ProdutosController', () => {
  let controller: ProdutosAPI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosAPI],
      providers: [ProdutosController],
    }).compile();

    controller = module.get<ProdutosAPI>(ProdutosAPI);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
