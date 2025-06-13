FROM node:18 AS builder 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build 

FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/build /app/build 

COPY package*.json ./
RUN npm install --only=production 

CMD ["npm", "start"]