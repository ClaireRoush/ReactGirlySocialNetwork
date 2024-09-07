# Use an official Node.js runtime as a parent image
FROM node:22-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 6969

# Define the command to run the app
CMD ["node", "app.js"]
