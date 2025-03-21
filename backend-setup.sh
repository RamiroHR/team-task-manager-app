#!/bin/bash

# Navigate to the backend directory
cd backend/

# Install dependencies
npm install

# Run prisma migrations
npx prisma migrate dev --name init

# Generate the prisma client
npx prisma generate

# Start the backend server
node src/index.js
