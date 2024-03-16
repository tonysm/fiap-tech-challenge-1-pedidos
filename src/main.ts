import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfirmarPagamentoChannel } from './externals/channels/confirmar.pagamento.channel';
import { FinalizarPedidoChannel } from './externals/channels/finalizar.pedido.channel';

async function bootstrapChannels(app) {
  const channels = [
    app.get(ConfirmarPagamentoChannel),
    app.get(FinalizarPedidoChannel),
  ];

  await Promise.all(channels.map(channel => channel.registerMessageConsumer()));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Pedidos API')
    .setDescription('A API para os sistema de gerenciamento de pedidos')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    }),
  );

  bootstrapChannels(app)

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
