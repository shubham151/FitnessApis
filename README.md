# Fitness API

This is the Fitness API project, which provides endpoints for user authentication, exercise management, and various features like favoriting, saving, rating exercises, and searching exercises.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Test Cases](#test-cases)

## Installation

To set up the project, follow these steps:

```bash
# Clone the repository
git clone https://github.com/shubham151/FitnessApis.git
cd FitnessAPI

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory and configure it as follows:

```ini
# Server configuration
PORT=4000

# JWT configuration
JWT_SECRET=MY_SUPER_SECRET
JWT_REFRESH_SECRET=MY_REFRESH_SECRET

# Database configuration (PostgreSQL)
DB_HOST=localhost
DB_USER=spidermines
DB_PASSWORD=12345
DB_DATABASE=fitness
DB_PORT=5432
DB_CLIENT=pg
DB_DATABASE_MIG=migration_test
```

## Running the Server

Start the API server with:

```bash
npm start
```

For development mode with live reload:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

## Database Migrations

Refer to the migration steps documented in [FitnessAPIMigrationSteps.md](./FitnessAPIMigrationSteps.md).

To run migrations:

```bash
npx knex migrate:latest --env development
```

To rollback migrations:

```bash
npx knex migrate:rollback --env development
```

## API Documentation

For detailed API endpoints, request parameters, and responses, check [FitnessAPIDocumentation.md](./FitnessAPIDocumentation.md).

## Test Cases

For comprehensive test cases covering all API endpoints, refer to [FitnessAPITestCases.md](./FitnessAPITestCases.md). You can use Postman collections for automated testing.