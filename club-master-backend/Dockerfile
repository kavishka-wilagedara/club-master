# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml first to leverage caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Debug: list files to ensure jar exists
RUN ls -l target/

# Stage 2: Runtime
FROM eclipse-temurin:17-jdk-focal AS runner
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/uokclubmanagement-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 7000

ENTRYPOINT ["java", "-jar", "app.jar"]
