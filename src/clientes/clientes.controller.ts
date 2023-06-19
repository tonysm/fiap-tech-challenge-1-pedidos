import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    try {
        return await this.clientesService.create(createClienteDto);
    } catch (err) {
        throw new HttpException("Não foi possivel criar o cliente", HttpStatus.UNPROCESSABLE_ENTITY, { cause: err });
    }
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('cpf/:cpf')
  async findByCpf(@Param('cpf') cpf: string) {
    const cliente = await this.clientesService.findByCpf(cpf);

    if (! cliente) {
        throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }

    return cliente;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clientesService.findOne(+id);

    if (! cliente) {
        throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }

    return cliente;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
