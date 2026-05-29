FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 3000
CMD ["node_modules/.bin/tsx", "src/index.ts"]
