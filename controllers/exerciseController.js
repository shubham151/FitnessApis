import { getDB } from '../config/db.js';

let createExercise =  async (req, res) => {
  try {
    const { name, description, difficulty, isPublic } = req.body;
    const createdBy = req.user.id;
    const db = getDB();
    const [exercise] = await db('exercises')
      .insert({
        name,
        description,
        difficulty,
        is_public: isPublic || false,
        created_by: createdBy
      })
      .returning(['rec_id', 'name', 'description', 'difficulty', 'is_public', 'created_by']);
    res.status(201).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let getAllPublicExercises = async (req, res) => {
  try {
    const db = getDB();
    const exercises = await db('exercises')
      .where({ is_public: true, rec_status: 'A' })
      .leftJoin('favorites', 'exercises.rec_id', 'favorites.exercise_id')
      .leftJoin('saves', 'exercises.rec_id', 'saves.exercise_id')
      .groupBy('exercises.rec_id')
      .select(
        'exercises.rec_id',
        'exercises.name',
        'exercises.description',
        'exercises.difficulty',
        'exercises.is_public',
        db.raw('COUNT(DISTINCT favorites.rec_id) as favorite_count'),
        db.raw('COUNT(DISTINCT saves.rec_id) as save_count')
      );
    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let getExerciseById = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    const exercise = await db('exercises')
      .where({ rec_id: exerciseId, rec_status: 'A' })
      .first();
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    // Allow access if exercise is public or if the user is the creator.
    if (!exercise.is_public && exercise.created_by !== userId) {
      return res.status(403).json({ message: 'Not allowed to view this exercise' });
    }
    // Retrieve favorite and save counts.
    const [counts] = await db('exercises')
      .leftJoin('favorites', 'exercises.rec_id', 'favorites.exercise_id')
      .leftJoin('saves', 'exercises.rec_id', 'saves.exercise_id')
      .where('exercises.rec_id', exerciseId)
      .groupBy('exercises.rec_id')
      .select(
        db.raw('COUNT(DISTINCT favorites.rec_id) as favorite_count'),
        db.raw('COUNT(DISTINCT saves.rec_id) as save_count')
      );
    res.json({ ...exercise, ...counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let updateExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const { name, description, difficulty, isPublic } = req.body;
    const db = getDB();
    // Check for exercise existence and ownership.
    const exercise = await db('exercises')
      .where({ rec_id: exerciseId, rec_status: 'A' })
      .first();
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    if (exercise.created_by !== userId) {
      return res.status(403).json({ message: 'Not allowed to update this exercise' });
    }
    const [updatedExercise] = await db('exercises')
      .where({ rec_id: exerciseId })
      .update({
        name,
        description,
        difficulty,
        is_public: isPublic,
        updated_at: new Date()
      })
      .returning(['rec_id', 'name', 'description', 'difficulty', 'is_public']);
    res.json(updatedExercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let deleteExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    // Check for existence and ownership.
    const exercise = await db('exercises')
      .where({ rec_id: exerciseId, rec_status: 'A' })
      .first();
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    if (exercise.created_by !== userId) {
      return res.status(403).json({ message: 'Not allowed to delete this exercise' });
    }
    // Mark the record as inactive instead of a hard delete.
    await db('exercises')
      .where({ rec_id: exerciseId })
      .update({ rec_status: 'I', updated_at: new Date() });
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// --------------------
// BONUS: Additional Endpoints
// --------------------

// Favorite an Exercise
let favoriteExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    await db('favorites')
      .insert({
        user_id: userId,
        exercise_id: exerciseId
      })
      .onConflict(['user_id', 'exercise_id'])
      .ignore();
    res.json({ message: 'Favorited' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Unfavorite an Exercise
let unfavoriteExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    await db('favorites')
      .where({
        user_id: userId,
        exercise_id: exerciseId,
        rec_status: 'A'
      })
      .del();
    res.json({ message: 'Unfavorited' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Save an Exercise
let saveExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    await db('saves')
      .insert({
        user_id: userId,
        exercise_id: exerciseId
      })
      .onConflict(['user_id', 'exercise_id'])
      .ignore();
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Unsave an Exercise
let unsaveExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const db = getDB();
    await db('saves')
      .where({
        user_id: userId,
        exercise_id: exerciseId,
        rec_status: 'A'
      })
      .del();
    res.json({ message: 'Unsaved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Rate an Exercise
let rateExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const { rating } = req.body;
    const db = getDB();
    await db('ratings')
      .insert({
        user_id: userId,
        exercise_id: exerciseId,
        rating
      })
      .onConflict(['user_id', 'exercise_id'])
      .merge();
    res.json({ message: 'Rating submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get Combined Favorites and Saves List for a User
let getFavoritesSavesList = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDB();
    const favorites = await db('favorites')
      .join('exercises', 'favorites.exercise_id', 'exercises.rec_id')
      .where('favorites.user_id', userId)
      .select('exercises.rec_id', 'exercises.name', 'exercises.description', db.raw("'favorite' as type"));
    const saves = await db('saves')
      .join('exercises', 'saves.exercise_id', 'exercises.rec_id')
      .where('saves.user_id', userId)
      .select('exercises.rec_id', 'exercises.name', 'exercises.description', db.raw("'save' as type"));
    res.json([...favorites, ...saves]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get Users Who Favorited a Specific Exercise
let getUsersWhoFavorited = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const db = getDB();
    const users = await db('favorites')
      .join('users', 'favorites.user_id', 'users.rec_id')
      .where('favorites.exercise_id', exerciseId)
      .select('users.rec_id', 'users.username');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get Users Who Saved a Specific Exercise
let getUsersWhoSaved = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const db = getDB();
    const users = await db('saves')
      .join('users', 'saves.user_id', 'users.rec_id')
      .where('saves.exercise_id', exerciseId)
      .select('users.rec_id', 'users.username');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export {
  createExercise,
  getAllPublicExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  favoriteExercise,
  unfavoriteExercise,
  saveExercise,
  unsaveExercise,
  rateExercise,
  getFavoritesSavesList,
  getUsersWhoFavorited,
  getUsersWhoSaved
};
