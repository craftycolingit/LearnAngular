# Get the official Node.js image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/local/api

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Environment variables
ENV MODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]