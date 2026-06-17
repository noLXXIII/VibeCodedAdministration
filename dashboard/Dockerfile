FROM node:20-alpine AS build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache git docker-cli docker-cli-compose
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
