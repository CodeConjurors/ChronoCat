FROM maven:3-eclipse-temurin-17-alpine AS build-stage

WORKDIR /build
COPY . .
RUN mvn clean package -Dmaven.test.skip

FROM eclipse-temurin:17-jdk-alpine

COPY --from=build-stage /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
