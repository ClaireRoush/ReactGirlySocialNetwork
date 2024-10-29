# Use an official Node.js image to build the React app
FROM node:22-alpine3.19

# Set the working directory
WORKDIR /usr/app

COPY package*.json ./

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]