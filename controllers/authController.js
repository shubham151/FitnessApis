import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { createUser, findUserByUsername } from "../models/userModel.js";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/constants.js";

const { sign, verify } = jwt;

//Register New/Reactivate user
let register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      if (existingUser.rec_status === "A") {
        return res.status(400).json({ message: "Username already exists" });
      } else if (existingUser.rec_status === "D") {
        const reactivatedUser = await reactivateUser(existingUser.rec_id);
        return res
          .status(200)
          .json({
            message: "Account reactivated",
            rec_id: reactivatedUser.rec_id,
          });
      }
    }
    const user = await createUser(username, password);
    res.status(201).json({ rec_id: user.rec_id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
let login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const match = await compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate tokens using user.rec_id as the identifier.
    const accessToken = sign({ userId: user.rec_id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = sign({ userId: user.rec_id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh new token
let refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newAccessToken = sign({ userId: decoded.userId }, JWT_SECRET, {
        expiresIn: "15m",
      });
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reactivate existing user
let reactivateUser = async (rec_id) => {
  const db = getDB();
  // Changes needed in case if we want to update password as well
  const [user] = await db("users")
    .where({ rec_id })
    .update({
      rec_status: "A",
      updated_at: new Date(),
    })
    .returning(["rec_id", "username"]);
  return user;
};

export { register, login, refreshToken, reactivateUser };
