
# 1. Dependencies

FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci



# 2. Build

FROM deps AS build

COPY . .

RUN npx prisma generate --config ./prisma7.config.ts

RUN npm run build


# 3. Production

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated

EXPOSE 3000

CMD ["npm", "start"]