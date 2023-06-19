## Description

Repositório do tech challenge 1 da FIAP/Alura. Repositório de testes.

## Installation

```bash
cp .env.example .env
docker compose up -d
```

## Building the Production Image

```bash
docker build -t fiap-pedidos-app .
```

## Test

```bash
docker compose exec api npm run test
```
