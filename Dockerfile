# --- Stage 1: Base & Tini Installation ---
FROM node:20-slim AS base
WORKDIR /app

# Install tini safely and clean up apt cache to keep image small
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Install all dependencies (including devDependencies)
RUN npm install

# --- Stage 2: Development ---
FROM node:20-slim AS development
WORKDIR /app
ENV NODE_ENV=development

# Install tini for dev stage graceful shutdowns
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

COPY --from=base /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

# Use Tini as the entrypoint wrapper
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "run", "start:dev"]


# --- Stage 3: Build for Production ---
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build
RUN npm prune --production


# --- Stage 4: Production Run ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production

# Install tini for production stability
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

# Use Tini as the entrypoint wrapper
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
