# Use Node.js base image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from outside monorepo
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Change directory back to student
WORKDIR /usr/src/app/apps/student

# Copy the rest of the application code
COPY . .

# Expose port if needed
# EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
