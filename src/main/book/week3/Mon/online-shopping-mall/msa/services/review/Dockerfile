FROM node:18-alpine

WORKDIR /app

# Copy service package.json
COPY services/review/package*.json ./

# Install dependencies
RUN npm install

# Copy service source code  
COPY services/review/ ./

# Expose port
EXPOSE 3007

# Start the service
CMD ["npm", "start"]
