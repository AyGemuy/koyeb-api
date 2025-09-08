FROM node:latest

# Install necessary packages including Chromium and XVFB
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    chromium \
    chromium-driver \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Set the environment variable for Chromium binary
ENV CHROME_BIN=/usr/bin/chromium

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to leverage Docker cache
COPY package*.json ./

# Install Node.js dependencies
# Using `npm ci` is often preferred in Docker for reproducible builds if you have package-lock.json
# Otherwise, `npm install` is fine. `npm update` is generally not needed here.
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your Node.js application listens on (7860 as per your app.js)
EXPOSE 7860

# Command to run your Node.js application
# This will keep the container running as long as app.js is active
CMD ["npm", "start"]