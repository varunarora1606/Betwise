# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm i

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm i --omit=dev

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
