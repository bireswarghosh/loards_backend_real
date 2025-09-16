# Prisma Setup Instructions

This document explains how to fix the "Cannot read properties of undefined (reading 'findMany')" error and properly set up Prisma in your project.

## What was fixed

1. Created a singleton Prisma client instance to be used across the application
2. Updated all controllers to use this singleton instance
3. Added proper shutdown hooks for the Prisma client
4. Added scripts for generating the Prisma client

## How to use

1. First, generate the Prisma client:

```bash
npm run prisma:generate
```

2. Start the server:

```bash
npm run dev
```

3. If you want to explore your database with Prisma Studio:

```bash
npm run prisma:studio
```

## Troubleshooting

If you still encounter issues with Prisma:

1. Make sure your database is running and accessible
2. Check that the connection URL in `prisma/schema.prisma` is correct
3. Try running `npx prisma db pull` to update your schema from the database
4. Run `npx prisma generate` to regenerate the client

## Common Prisma errors

- **"Cannot read properties of undefined (reading 'findMany')"**: This usually means the Prisma client wasn't properly initialized or isn't available when a controller tries to use it.
- **"P2025: Record not found"**: This means the record you're trying to update or delete doesn't exist.
- **"P2002: Unique constraint failed"**: This means you're trying to create a record with a value that should be unique but already exists.

## Best practices

- Always use the singleton Prisma client instance from `prisma/client.js`
- Properly handle errors in your controllers
- Use transactions for operations that involve multiple database changes
- Close the Prisma client when your application shuts down