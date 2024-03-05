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

Para inicializar a aplicação, rode os comandos:

```bash
cp .env.example .env
docker compose up
```

Quando o container do MySQL subir com sucesso, a aplicação vai automaticamente aplicar as migrações quando subir. Após isso, você pode acessar a API no navegador [http://localhost:3000/api](http://localhost:3000/api).

## Documentação das APIs

Para documentação das APIs utilizamos o framework Swagger. Após a inicialização da aplicação o mesmo fica disponível em [http://localhost:3000/api](http://localhost:3000/api), onde é possível realizar requisições para os endpoints através do mesmo.

Na própria página do Swagger é disponibilizado exemplos de requests.

## Recursos REST disponibilizados

- CRUD de clientes
- CRUD de produtos
- Criação e gerenciamento de pedidos

### Fluxo de recursos rest para criação de pedido

Os passos para testar a API são os seguintes:

1. Criar produtos
1. Criar cliente (opcional)
1. Criar pedido (passar o ID do cliente é opcional)
1. Adicionar item ao pedido (usando os IDs dos produtos e do pedido que foi criado)
1. Confirmar pedido (o pagamento será automaticamente realizado)

Após esses passos, o pedido irá pra linha de produção da cozinha. O mesmo estará disponivel no endpoint de pedidos das cozinhas. A etapa em que o pedido está poderá ser atualizada usando o endpoint de atualizar etapa. Ao mudar o status pra "recebido", o pedido não retornará mais no endpoint da linha de produção da cozinha. Nessa etapa, o status do pedido pode ser mudado para os seguintes:

- `RECEBIDO`: O pagamento foi confirmado e está pronto para ser produzido
- `EM_PREPARACAO`: O pedido está sendo preparado
- `PRONTO`: O pedido está pronto e o cliente pode busca-lo
- `FINALIZADO`: O pedido foi entregue ao cliente

Você pode testar a API direto da documentação do Swagger, aqui alguns exemplos usando CURL direto do terminal:

1. Inicialização do pedido sendo opcional informar o id de um cliente pré cadastrado

```bash
curl -X 'POST' \
  'http://localhost:3000/pedidos' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "clienteId": null
}'
```

2. Adição de itens no pedido

```bash
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

```bash
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

```bash
curl -X 'DELETE' \
  'http://localhost:3000/pedidos/2/itens/1' \
  -H 'accept: */*'
```

5. Confirmação de pagamento do pedido

```bash
curl -X 'POST' \
  'http://localhost:3000/pedidos/2/confirm' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

6. Inicio da prepração do pedido

```bash
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "EM_PREPARACAO"
}'
```

6. Conclusão da preparação do pedido

```bash
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "PRONTO"
}'
```

7. Finalização do pedido

```bash
curl -X 'PUT' \
  'http://localhost:3000/cozinha/pedidos/2/status' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "status": "FINALIZADO"
}'
```

## Deployment no Kubernetes

Nossos templates para deployment no K8s estão na pasta [`k8s/`](./k8s/). Para fazer o deploy da aplicação basta apenas executar:

```bash
kubectl apply -f k8s/
```

Após isso, a aplicação irá inicializar. Estamos contando que o deployment será feito no Minikube. Para testar a aplicação no browser, é só pegar o IP da VM do Minikube e abrir na porta `30001` no navegador:

```bash
minikube ip
192.168.49.2 #  exemplo
```

Nesse exemplo, é só acessar: http://192.168.49.2:30001, mas o seu IP pode ser diferente.
