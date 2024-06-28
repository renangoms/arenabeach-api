FROM node:21-alpine

WORKDIR /usr/app

RUN npm i -g @nestjs/cli

COPY package*.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
