FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline

# Build the application
COPY src src
RUN mvn -B -ntp clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /workspace/target/*.jar app.jar

# Render provides PORT; default to 8080 for local runs
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh","-c","java -Dserver.port=$PORT -jar app.jar"]