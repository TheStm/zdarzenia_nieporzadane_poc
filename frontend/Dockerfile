FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN mkdir -p /app/node_modules/.vite

EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]
