# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /workspace

# Install create-vite globally
RUN npm install -g create-vite

# Create Vite React app
RUN npm create vite@latest my-react-app -- --template react

# Change to the app directory
WORKDIR /workspace/my-react-app

# Install dependencies
RUN npm install

# Expose port for Vite dev server (default 5173)
EXPOSE 5173

# Expose additional port for potential backend/api
EXPOSE 3000

# Install useful development tools
RUN npm install -g nodemon concurrently

# Keep container running and start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]