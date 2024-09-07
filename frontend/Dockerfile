# Use an official Node.js image to build the React app
FROM node:22-alpine3.19 AS build

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

# Copy the build output to replace the default nginx contents
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]