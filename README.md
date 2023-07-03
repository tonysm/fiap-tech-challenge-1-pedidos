## Description

Repositório do tech challenge 1 da FIAP/Alura


## Construção da aplicação

As principais tecnologias utilizadas na consutração da aplicação foram:

- Linguagem TypeScript
- Framework NestJS
- Banco de dados MySQL
- Swagger para documentação das APIs

## Documentação de domínio

Para documenação dos fluxos criamos um board na ferramenta Miro onde foi desenhado o fluxo de negócio e disponibilizado o dicionário de linguagem ubíqua.

Link de acesso ao Miro: https://miro.com/app/board/uXjVMCbokg0=/?share_link_id=11757782716

## Inicialização da aplicação

Para iniciar a aplicação foi disponibilizado um aquivo **docker-compose.yml** com as configurações necessárias para execução, incluindo o build da aplição em uma imagem Docker e um container para o banco de dados MySQL.

Comando de inicialização:
```docker compose up```

## Documentação das APIs

Para documentação das APIs utilizamos o framework Swagger. Após a inicialização da aplicação o mesmo fica disponível em [http://localhost:3000/api](http://localhost:3000/api), onde é possível realizar requisições para os endpoints através do mesmo.

Na própria página do Swagger é disponibilizado exemplos de requests.

## Recursos REST disponibilizados

- CRUD de clientes
- CRUD de produtos
- Criação e gerenciamento de pedidos

### Fluxo de recursos rest para criação de pedido

1. Inicialização do pedido sendo opcional informar o id de um cliente pré cadastrado

```curl
curl -X 'POST' \
  'http://localhost:3000/pedidos' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "clienteId": null
}'
```

2. Adição de itens no pedido

```curl
curl -X 'POST' \
  'http://localhost:3000/pedidos/2/itens' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "produtoId": 1,
  "quantidade": 1,
  "observacao": "Sem picles"
}'
```

3. Atualização de itens já inseridos no pedido caso necessário

```curl
curl -X 'PATCH' \
  'http://localhost:3000/pedidos/2/itens/1' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "quantidade": 5,
  "observacao": "Com bastante picles"
}'
```

4. Remoção de itens já inseridos no pedido caso necessário

```curl
curl -X 'DELETE' \
  'http://localhost:3000/pedidos/2/itens/1' \
  -H 'accept: */*'
```

5. Confirmação de pagamento do pedido

```curl
curl -X 'POST' \
  'http://localhost:3000/pedidos/2/confirm' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

6. Inicio da prepração do pedido

```curl
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "EM_PREPARACAO"
}'
```

6. Conclusão da preparação do pedido

```curl
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "PRONTO"
}'
```

7. Finalização do pedido

```curl
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "FINALIZADO"
}'
```
