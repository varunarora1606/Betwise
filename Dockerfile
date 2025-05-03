FROM node:20-alpine

ARG DATABASE_URL

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install
COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]