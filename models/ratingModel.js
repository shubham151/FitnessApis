import { getDB } from '../config/db.js';

let addOrUpdateRating = async (userId, exerciseId, rating) => {
  const db = getDB();
  await db('ratings')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      rating
    })
    .onConflict(['user_id', 'exercise_id'])
    .merge();
}

let getRating = async (userId, exerciseId) => {
  const db = getDB();
  const record = await db('ratings')
    .where({
      user_id: userId,
      exercise_id: exerciseId,
      rec_status: 'A'
    })
    .first();
  return record;
}

export {
  addOrUpdateRating,
  getRating
};
