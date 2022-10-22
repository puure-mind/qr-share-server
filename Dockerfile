# build for dev
FROM node:18-alpine as develop

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# build for prod
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=develop /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

#production
FROM node:18-alpine as production

COPY --from=build /usr/src/app/node_modules/ ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
