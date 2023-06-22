import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ProdutosService } from 'src/core/produtos/produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Categoria } from 'src/core/produtos/entities/produto.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('produtos')
@ApiTags('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @ApiQuery({ name: 'categoria', required: false, type: 'enum', enum: Categoria })
  findAll(@Query('categoria') categoria: Categoria) {
    if (categoria) {
        return this.produtosService.findAllByCategoria(categoria);
    }

    return this.produtosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const produto = await this.produtosService.findOne(+id);

    if (! produto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND)
    }

    return produto
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
