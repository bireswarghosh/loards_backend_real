import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Generate Prisma client if not exists
try {
  if (process.env.NODE_ENV === 'production') {
    execSync('node node_modules/prisma/build/index.js generate', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('Prisma generate skipped or already exists');
}

// Create a singleton instance of PrismaClient
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;