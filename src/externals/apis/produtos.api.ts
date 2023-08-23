import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, Inject } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Categoria } from 'src/core/produtos/entities/produto.entity';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProdutosControllerInterface } from 'src/core/produtos/controller/produtos.controller.interface';

@Controller('produtos')
@ApiTags('produtos')
export class ProdutosAPI {
  
  constructor(
    @Inject(ProdutosControllerInterface)
    private readonly produtosController: ProdutosControllerInterface
  ) {}

  @ApiOperation({ summary: 'Cria um novo produto' })
  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosController.create(createProdutoDto);
  }

  @ApiOperation({ summary: 'Busca produtos por categoria' })
  @Get()
  @ApiQuery({ name: 'categoria', required: false, type: 'enum', enum: Categoria })
  findAll(@Query('categoria') categoria: Categoria) {
    if (categoria) {
      return this.produtosController.findAllByCategoria(categoria);
    }

    return this.produtosController.findAll();
  }

  @ApiOperation({ summary: 'Busca produto por id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const produto = await this.produtosController.findOne(+id);

    if (! produto) throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND)

    return produto
  }

  @ApiOperation({ summary: 'Atualiza os dados de um produto' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosController.update(+id, updateProdutoDto);
  }

  @ApiOperation({ summary: 'Exclui um produto' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosController.remove(+id);
  }
}
