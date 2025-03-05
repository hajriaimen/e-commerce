FROM node:alpine
 
# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0
 
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm  install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build
RUN  cp -a dist/. public/
# Set the command to run the production build of the React app
CMD ["npm", "run", "dev"]