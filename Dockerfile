FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Expose port 3000
EXPOSE 3000

# Use nodemon for development
CMD ["npm", "run", "dev"]