#!/usr/bin/bash

PROJECT_ID="pedidos-app"
TOPIC="confirmar-pagamento-topic"
PEDIDO_ID=${1}
STATUS=${2}
# STATUS="SUCESSO"
# STATUS="FALHA"

PAYLOAD=`echo "{\"pedido\": \"${PEDIDO_ID}\", \"resultadoPagamento\": \"${STATUS}\"}" | base64`

# echo $PAYLOAD

curl -s -X POST "http://localhost:8085/v1/projects/${PROJECT_ID}/topics/${TOPIC}:publish" \
    -H 'Content-Type: application/json' \
    --data "{\"messages\":[{\"data\":\"${PAYLOAD}\"}]}"
