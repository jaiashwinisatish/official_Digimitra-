# Multi-stage Dockerfile for Digimitra

# Stage 1: Build Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend & Final Image
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
COPY --from=frontend-build /app/frontend/dist ./server/public

EXPOSE 5000
WORKDIR /app/server
CMD ["npm", "start"]
