import { getDB } from '../config/db.js';

let addSave = async (userId, exerciseId) => {
  const db = getDB();
  await db('saved_exercise')
    .insert({
      user_id: userId,
      exercise_id: exerciseId
    })
    .onConflict(['user_id', 'exercise_id'])
    .ignore();
}

let removeSave = async (userId, exerciseId) => {
  const db = getDB();
  await db('saved_exercise')
    .where({
      user_id: userId,
      exercise_id: exerciseId,
      rec_status: 'A'
    })
    .del();
}

export {
  addSave,
  removeSave
};
