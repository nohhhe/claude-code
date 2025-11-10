FROM node:18-alpine

WORKDIR /app

# Copy gateway package.json
COPY gateway/package*.json ./

# Install dependencies
RUN npm install

# Copy gateway source code
COPY gateway/ ./

# Expose port
EXPOSE 3000

# Start the gateway
CMD ["npm", "start"]