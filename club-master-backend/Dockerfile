FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-focal AS runner

WORKDIR /app

COPY --from=builder /app/target/app.jar app.jar

EXPOSE 7000

ENTRYPOINT ["java", "-jar", "app.jar"]
