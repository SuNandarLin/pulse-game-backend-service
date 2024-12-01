# Build stage
# Use a Node.js 18.12 image as the builder stage
FROM node:20.5.1 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json for npm ci
COPY package*.json ./

# Copy the Prisma directory
#COPY prisma ./prisma/

# Install project dependencies using npm ci
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma client based on the schema
RUN npx prisma generate --schema ./prisma/schema.prisma

# Build the application
RUN npm run build

# Create a new stage for the production image
FROM node:20.5.1

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV="production"

# Copy the production-ready node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json for reference
COPY --from=builder /app/package*.json ./

# Copy the compiled application code
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and client from the builder stage
COPY --from=builder /app/prisma ./prisma

# Expose port 8080 for incoming connections
EXPOSE 8080

# Run the application with the specified npm command
CMD ["npm", "run", "start:migrate:prod"]