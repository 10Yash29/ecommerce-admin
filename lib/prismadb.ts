import { PrismaClient } from '@prisma/client';

// Declare global variable (optional for improved TypeScript support)
declare global {
    var prisma: PrismaClient | undefined;
}

// Check if a Prisma client already exists globally
const prismadb = global.prisma || new PrismaClient();

// In production, ensure a single Prisma client is reused
if (process.env.NODE_ENV === 'production') {
    global.prisma = prismadb;
}

// Explicitly use the variable (e.g., by logging a message)
if (process.env.NODE_ENV !== 'production') {
    console.log('Prisma client initialized in development mode.');
}

export default prismadb;
