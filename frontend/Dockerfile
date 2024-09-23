# Use an official Node.js image to build the React app
FROM node:20-alpine3.19 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use an nginx image to serve the static build
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 for the nginx server
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
