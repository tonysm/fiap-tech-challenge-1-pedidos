FROM node:18 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Build Stage
FROM node:18 as build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

COPY . .

ENV NODE_ENV production

RUN npm run build && npm ci --only=production && npm cache clean --force

CMD [ "node", "dist/main.js" ]

# Production Stage...
FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
