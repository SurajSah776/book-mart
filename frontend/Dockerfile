# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Install a simple web server to serve the static files
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["serve", "-s", "dist", "-l", "3000"]
