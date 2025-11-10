FROM node:18-alpine

WORKDIR /app

# Copy service package.json
COPY services/shipping/package*.json ./

# Install dependencies
RUN npm install

# Copy service source code  
COPY services/shipping/ ./

# Expose port
EXPOSE 3005

# Start the service
CMD ["npm", "start"]
