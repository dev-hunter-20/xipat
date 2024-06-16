# Install dependencies only when needed
FROM node:18-alpine as builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git

WORKDIR /apps

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY .env.development ./
COPY .env.production ./
COPY .env.production ./.env
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production images
FROM node:18-alpine
WORKDIR /apps

COPY --from=builder /apps/next.config.mjs ./
COPY --from=builder /apps/public ./public
COPY --from=builder /apps/.next ./.next
COPY --from=builder /apps/.env ./.env
COPY --from=builder /apps/node_modules ./node_modules
COPY --from=builder /apps/package.json ./package.json

ENV NODE_ENV=production

# If using npm comment out above and use below instead
EXPOSE 3000

CMD ["npm", "start"]