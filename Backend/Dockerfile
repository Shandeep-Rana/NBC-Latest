# Use a base Node.js image
FROM node:21.7.1-alpine

# Set the working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package-lock.json package-lock.json
COPY package.json package.json

RUN a2enmod rewrite
COPY httpd.conf
COPY .htaccess

# Copy the rest of the application files
COPY . .

# Install dependencies
RUN npm install

# Command to run the application
CMD ["node", "src/app.js"]