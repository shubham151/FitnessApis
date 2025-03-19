# Database Migrations Documentation

This document explains how to set up and run database migrations for the Fitness API project using Knex and PostgreSQL.

## Prerequisites

- **Node.js & npm:** Ensure you have Node.js and npm installed.
- **PostgreSQL:** Make sure PostgreSQL is installed and running.
- **Knex CLI:** If not installed globally, you can use `npx` to run Knex commands.

## Project Files

### `knexfile.js`

This file contains the configuration settings for Knex, including your database connection details and the directories for migrations and seeds. Execute below steps after setting .env


## Run Migration Steps

```bash
npx knex migrate:latest --env development
```


## Rollback Migration

```bash
npx knex migrate:rollback --env development
```
