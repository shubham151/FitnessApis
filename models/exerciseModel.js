const { getDB } = require('../config/db.js');

let createExercise = async ({ name, description, difficulty, isPublic, createdBy }) => {
  const db = getDB();
  const [exercise] = await db('exercises')
    .insert({
      name,
      description,
      difficulty,
      is_public: isPublic || false,
      created_by: createdBy
    })
    .returning([
      'rec_id',
      'name',
      'description',
      'difficulty',
      'is_public',
      'created_by'
    ]);
  return exercise;
}

let getExerciseById = async (rec_id) => {
  const db = getDB();
  const exercise = await db('exercises')
    .where({ rec_id, rec_status: 'A' })
    .first();
  return exercise;
}

export {
  createExercise,
  getExerciseById
};
