CREATE TABLE users (
  rec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rec_status CHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
  rec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty INT,
  is_public BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  rec_status CHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(rec_id)
);


CREATE TABLE favorites (
  rec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  rec_status CHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(rec_id),
  CONSTRAINT fk_fav_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(rec_id),
  CONSTRAINT unique_user_exercise UNIQUE (user_id, exercise_id)
);


CREATE TABLE saved_exercise (
  rec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  rec_status CHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_save_user FOREIGN KEY (user_id) REFERENCES users(rec_id),
  CONSTRAINT fk_save_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(rec_id),
  CONSTRAINT unique_save_user_exercise UNIQUE (user_id, exercise_id)
);


CREATE TABLE ratings (
  rec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  rec_status CHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(rec_id),
  CONSTRAINT fk_rating_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(rec_id),
  CONSTRAINT unique_rating_user_exercise UNIQUE (user_id, exercise_id)
);


CREATE EXTENSION IF NOT EXISTS pgcrypto;
