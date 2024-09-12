# 构建阶段
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM node:14-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/server /app/server
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "server/server.js"]
