FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Re-install ALL deps (including devDeps) for the build step
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ENV BUILD_STANDALONE=true
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/app/generated ./src/app/generated
# Copy production node_modules (no devDeps) for Prisma CLI at runtime
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
