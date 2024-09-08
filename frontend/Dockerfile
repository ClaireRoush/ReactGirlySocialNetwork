# Use an official Node.js image to build the React app
FROM node:22-alpine3.19 AS build

# Set the working directory
WORKDIR /usr/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# this let ignore cache
# ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use an nginx image to serve the static build
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /usr/app/build /usr/share/nginx/html
COPY --from=build /usr/app/static /usr/share/nginx/html/static
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]