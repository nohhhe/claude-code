FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY apps/web/package*.json ./

# Install dependencies  
RUN npm install

# Copy source code
COPY apps/web/ ./

# Expose port
EXPOSE 3100

# Start the web app
CMD ["npm", "run", "dev"]