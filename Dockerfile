# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy only the necessary files to the container
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# Expose port 80 to the outside world
EXPOSE 80

# Start the application
CMD ["npm", "start"]
