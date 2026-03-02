FROM node:24-alpine AS ui-builder
COPY ./ui /app
WORKDIR /app
RUN apk add --no-cache git \
    && corepack enable \
    && yarn install \
    && yarn build

FROM node:24-alpine AS ui
RUN yarn global add serve@14.2.5
COPY --from=ui-builder /app/dist /app/ui
EXPOSE 5000
CMD ["serve", "-s", "/app/ui"]
