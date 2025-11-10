FROM node:18-alpine

WORKDIR /app

# Copy service package.json
COPY services/cart/package*.json ./

# Install dependencies
RUN npm install

# Copy service source code  
COPY services/cart/ ./

# Expose port
EXPOSE 3006

# Start the service
CMD ["npm", "start"]
