FROM node:21-alpine

WORKDIR /usr/app

RUN npm i -g @nestjs/cli

COPY package*.json pnpm-lock.yaml yarn.lock ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate
CMD ["npm", "run", "start:dev"]
