CREATE INDEX idx_users_rec_status ON users(rec_status);
CREATE INDEX idx_exercises_status_public ON exercises(rec_status, is_public);
CREATE INDEX idx_exercises_created_by ON exercises(created_by);
CREATE INDEX idx_exercises_status_name ON exercises(rec_status, name);
CREATE INDEX idx_exercises_name_trgm ON exercises USING gin (name gin_trgm_ops);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_favorites_exercise_id ON favorites(exercise_id);
CREATE INDEX idx_saved_exercise_exercise_id ON saved_exercise(exercise_id);
CREATE INDEX idx_ratings_exercise_id ON ratings(exercise_id);

