import { getDB } from '../config/db.js';
import { hash } from 'bcrypt';

let createUser = async (username, password) => {
  const db = getDB();
  // Hash the password before inserting
  const hashed = await hash(password, 10);
  const [user] = await db('users')
    .insert({ username, password_hash: hashed })
    .returning(['rec_id', 'username']);
  return user;
}

let findUserByUsername  = async (username) => {
  const db = getDB();
  // Only return users with active rec_status ('A')
  const user = await db('users')
    .where({ username, rec_status: 'A' })
    .first();
  return user;
}

export {
  createUser,
  findUserByUsername
};
