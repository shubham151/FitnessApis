/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Enable the pgcrypto extension for UUID generation
    await knex.raw("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
  
    // Create users table
    await knex.schema.createTable("users", function (table) {
      table.uuid("rec_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("username", 255).notNullable().unique();
      table.string("password_hash", 255).notNullable();
      table.specificType("rec_status", "char(1)").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  
    // Create exercises table
    await knex.schema.createTable("exercises", function (table) {
      table.uuid("rec_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name", 255).notNullable();
      table.text("description");
      table.integer("difficulty");
      table.boolean("is_public").defaultTo(false);
      table.uuid("created_by").notNullable();
      table.specificType("rec_status", "char(1)").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("created_by").references("users.rec_id");
    });
  
    // Create favorites table
    await knex.schema.createTable("favorites", function (table) {
      table.uuid("rec_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("user_id").notNullable();
      table.uuid("exercise_id").notNullable();
      table.specificType("rec_status", "char(1)").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.foreign("user_id").references("users.rec_id");
      table.foreign("exercise_id").references("exercises.rec_id");
      table.unique(["user_id", "exercise_id"]);
    });
  
    // Create saved_exercise table
    await knex.schema.createTable("saved_exercise", function (table) {
      table.uuid("rec_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("user_id").notNullable();
      table.uuid("exercise_id").notNullable();
      table.specificType("rec_status", "char(1)").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.foreign("user_id").references("users.rec_id");
      table.foreign("exercise_id").references("exercises.rec_id");
      table.unique(["user_id", "exercise_id"]);
    });
  
    // Create ratings table
    await knex.schema.createTable("ratings", function (table) {
      table.uuid("rec_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("user_id").notNullable();
      table.uuid("exercise_id").notNullable();
      table.integer("rating").notNullable().checkBetween([1, 5]);
      table.specificType("rec_status", "char(1)").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.foreign("user_id").references("users.rec_id");
      table.foreign("exercise_id").references("exercises.rec_id");
      table.unique(["user_id", "exercise_id"]);
    });
  
    //Create indexs
    await knex.schema.raw(
      "CREATE INDEX idx_users_rec_status ON users(rec_status);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_exercises_status_public ON exercises(rec_status, is_public);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_exercises_created_by ON exercises(created_by);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);"
    );
    await knex.schema.raw("CREATE EXTENSION IF NOT EXISTS pg_trgm;");
    await knex.schema.raw(
      "CREATE INDEX idx_exercises_name_trgm ON exercises USING gin (name gin_trgm_ops);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_exercises_description_trgm ON exercises USING gin (description gin_trgm_ops);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_favorites_exercise_id ON favorites(exercise_id);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_saved_exercise_exercise_id ON saved_exercise(exercise_id);"
    );
    await knex.schema.raw(
      "CREATE INDEX idx_ratings_exercise_id ON ratings(exercise_id);"
    );
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists("ratings");
    await knex.schema.dropTableIfExists("saved_exercise");
    await knex.schema.dropTableIfExists("favorites");
    await knex.schema.dropTableIfExists("exercises");
    await knex.schema.dropTableIfExists("users");
  
    await knex.schema.raw("DROP INDEX IF EXISTS idx_ratings_exercise_id;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_saved_exercise_exercise_id;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_favorites_exercise_id;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_exercises_difficulty;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_exercises_name_trgm;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_exercises_description_trgm;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_exercises_created_by;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_exercises_status_public;");
    await knex.schema.raw("DROP INDEX IF EXISTS idx_users_rec_status;");
  }
  