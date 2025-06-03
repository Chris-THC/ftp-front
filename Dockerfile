# Stage 1: Build the application

FROM node:20-bullseye AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (using pnpm, yarn or npm based on what you use)
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-bullseye AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built assets from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Next.js collects completely anonymous telemetry data about general usage.
# Uncomment the following line to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]