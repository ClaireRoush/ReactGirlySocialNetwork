# Use an official Node.js image to build the React app
FROM node:22-alpine3.19

# Set the working directory
WORKDIR /usr/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# this let ignore cache
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

# Copy the rest of the application code
COPY . .

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]
