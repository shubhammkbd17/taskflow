FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "index.js"]