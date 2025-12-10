# Multi-stage build for Spring Boot application

# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY backend/pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY backend/src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/admissions-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render will override this with $PORT)
EXPOSE 8080

# Run the application with environment variable support
CMD java -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -Dserver.port=${PORT:-8080} -jar app.jar
