import { getDB } from '../config/db.js';

let addFavorite = async (userId, exerciseId) => {
  const db = getDB();
  // Inserts a new favorite record.
  // onConflict will ignore if the user already favorited this exercise.
  await db('favorites')
    .insert({
      user_id: userId,
      exercise_id: exerciseId
    })
    .onConflict(['user_id', 'exercise_id'])
    .ignore();
}

let removeFavorite = async (userId, exerciseId) => {
  const db = getDB();
  // Delete the favorite record for active entries
  await db('favorites')
    .where({
      user_id: userId,
      exercise_id: exerciseId,
      rec_status: 'A'
    })
    .del();
}

export {
  addFavorite,
  removeFavorite
};
