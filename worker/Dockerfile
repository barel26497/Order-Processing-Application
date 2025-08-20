FROM node:24-alpine
WORKDIR /app
COPY worker/package*.json ./
RUN npm ci
COPY shared ./shared
COPY worker/src ./src
EXPOSE 3001
CMD [ "node", "src/index.js" ]