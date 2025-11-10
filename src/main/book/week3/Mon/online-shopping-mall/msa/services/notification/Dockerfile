FROM node:18-alpine

WORKDIR /app

# Copy service package.json
COPY services/notification/package*.json ./

# Install dependencies
RUN npm install

# Copy service source code  
COPY services/notification/ ./

# Expose port
EXPOSE 3008

# Start the service
CMD ["npm", "start"]
