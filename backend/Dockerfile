# Use an official Node.js runtime as a parent image
FROM node:22-alpine3.19

# Set the working directory in the container
WORKDIR /usr/app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 6969

# Define the command to run the app
CMD ["npm", "run" , "start"]
