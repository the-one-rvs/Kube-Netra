# --- Stage 1: Build Node dependencies ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# --- Stage 2: Run API server with all tools installed ---
FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
    bash \
    jq \
    curl \
    git \
    openssh \
    ca-certificates \
    && rm -rf /var/cache/apk/*

COPY --from=builder /app ./

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "/app/entrypoint.sh"]

CMD ["npm", "start"]
