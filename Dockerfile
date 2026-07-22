# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Pass build arguments to environment variables
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Build the app
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built assets from the build stage
# Note: Vite builds to 'build' in this project based on standard setup
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
