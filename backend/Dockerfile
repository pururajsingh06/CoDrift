# Use Ubuntu as the base image for robust compiler support
FROM ubuntu:22.04

# Prevent timezone and keyboard prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install all necessary runtimes and compilers
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    gcc \
    g++ \
    openjdk-17-jdk \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy all package.json files
COPY package*.json ./
COPY api/package*.json ./api/
COPY realtime/package*.json ./realtime/

# Install root and workspace dependencies
RUN npm install
RUN npm install --prefix api
RUN npm install --prefix realtime

# Copy the entire backend source code
COPY . .

# Expose API and WebSocket ports
EXPOSE 3000
EXPOSE 1234

# Start both services
CMD ["npm", "run", "dev"]
