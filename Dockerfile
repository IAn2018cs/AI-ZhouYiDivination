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

# 安装字体和其他必要的包
RUN apk add --no-cache fontconfig ttf-dejavu
RUN mkdir -p /usr/share/fonts/chinese
COPY --from=build-stage /app/fonts/*.ttf /usr/share/fonts/chinese/
RUN fc-cache -f -v

COPY --from=build-stage /app/config /app/config
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/server /app/server
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "server/server.js"]
