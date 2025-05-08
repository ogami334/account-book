# --- build stage ---
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # .next/standalone, .next/static 生成

# --- runtime stage ---
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
ENV PORT=8080
EXPOSE 8080
CMD ["server.js"]
