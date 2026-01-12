FROM node:20-alpine AS ui-builder
COPY ./ui /app
WORKDIR /app
RUN apk add --no-cache git && yarn install && yarn build

FROM node:20-alpine AS ui
RUN yarn global add serve@12.0.1
COPY --from=ui-builder /app/build /app/ui
EXPOSE 5000
CMD ["serve", "-s", "/app/ui"]
