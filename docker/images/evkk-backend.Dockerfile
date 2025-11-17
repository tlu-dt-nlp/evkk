FROM eclipse-temurin:11-jdk AS backend-builder
COPY . /app
WORKDIR /app
RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:11-jre AS backend
COPY --from=backend-builder /app/dist /app
