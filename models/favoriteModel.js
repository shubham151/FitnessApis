import { getDB } from '../config/db.js';

let addFavorite = async (userId, exerciseId) => {
  const db = getDB();
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
