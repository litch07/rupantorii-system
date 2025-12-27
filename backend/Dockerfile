FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm install
RUN npm run prisma:generate

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
