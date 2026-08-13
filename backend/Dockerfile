FROM node:22-alpine AS typespec
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY main.tsp tspconfig.yaml ./
RUN npx tsp compile main.tsp

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY --from=typespec /workspace/tsp-output/schema/openapi.v1.yaml ./tsp-output/schema/openapi.v1.yaml
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN mvn -B -Dmaven.test.skip=true -f backend/pom.xml package

FROM eclipse-temurin:21-jre-alpine AS runtime
ENV PORT=8080
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=build --chown=spring:spring /build/backend/target/backend-0.0.1-SNAPSHOT.jar ./app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
