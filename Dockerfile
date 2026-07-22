FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

RUN apk add --no-cache nginx

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.openai ./.openai
COPY deploy/slovo-nginx.conf /etc/nginx/http.d/default.conf
COPY deploy/start-production.sh /usr/local/bin/start-production

RUN chmod +x /usr/local/bin/start-production

EXPOSE 3000
CMD ["/usr/local/bin/start-production"]
