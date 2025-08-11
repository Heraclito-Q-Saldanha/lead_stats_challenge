#!/bin/sh

echo "Running Drizzle Migrations..."
npm run db:push

echo "Starting NestJS application..."
npm run start:prod

