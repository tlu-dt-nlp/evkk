FROM evkk-jdk8-mvn AS backend-builder
COPY masinoppe_ennustus/ /app
WORKDIR /app
RUN mvn package --quiet

FROM eclipse-temurin:8-jre AS backend
COPY --from=backend-builder /app/target/masinoppe_ennustus-0.0.1-SNAPSHOT-jar-with-dependencies.jar /app/me.jar
COPY --from=backend-builder /app/arff /app/arff
COPY --from=backend-builder /app/config.txt /app/config.txt
COPY --from=backend-builder /app/models /app/models
