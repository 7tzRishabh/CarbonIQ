FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the full-stack Express server
CMD ["npm", "start"]
