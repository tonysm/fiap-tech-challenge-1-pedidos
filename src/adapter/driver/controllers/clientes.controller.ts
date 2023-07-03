import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientesServiceInterface } from 'src/core/clientes/clientes.service.interface';

@Controller('clientes')
@ApiTags('clientes')
export class ClientesController {
  constructor(
    @Inject(ClientesServiceInterface)
    private readonly clientesService: ClientesServiceInterface
  ) {}

  @ApiOperation({ summary: 'Cria um novo cliente' })
  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    try {
        return await this.clientesService.create(createClienteDto);
    } catch (err) {
        throw new HttpException("Não foi possivel criar o cliente", HttpStatus.UNPROCESSABLE_ENTITY, { cause: err });
    }
  }

  @ApiOperation({ summary: 'Lista os clientes' })
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @ApiOperation({ summary: 'Busca cliente por cpf' })
  @Get('cpf/:cpf')
  async findByCpf(@Param('cpf') cpf: string) {
    const cliente = await this.clientesService.findByCpf(cpf);

    if (! cliente) {
        throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }

    return cliente;
  }

  @ApiOperation({ summary: 'Busca cliente por id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clientesService.findOne(+id);

    if (! cliente) {
        throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }

    return cliente;
  }

  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @ApiOperation({ summary: 'Exclui um cliente' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
