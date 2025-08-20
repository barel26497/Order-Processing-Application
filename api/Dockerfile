FROM node:24-alpine
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY shared ./shared
COPY api/src ./src
EXPOSE 3001
CMD [ "node", "src/index.js" ]