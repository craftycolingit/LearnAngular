# Stage 1: Build the Angular app
# Get the official Node.js image
FROM node:alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npx ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the Angular app
# Get the official Nginx image
FROM nginx:latest

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx html folder
COPY --from=build /app/dist/ticketmaster/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80