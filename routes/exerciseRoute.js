import { Router } from 'express';
const router = Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import { createExercise, getAllPublicExercises, getExerciseById, updateExercise, deleteExercise, favoriteExercise, unfavoriteExercise, saveExercise, unsaveExercise, rateExercise, getFavoritesSavesList, getUsersWhoFavorited, getUsersWhoSaved, reactivateExercise, searchExercises } from '../controllers/exerciseController.js';

// All routes below require authentication.
router.use(authMiddleware);

// CRUD endpoints for exercises
router.post('/', createExercise); // Create exercise
router.get('/', getAllPublicExercises); // Get all public exercises
router.get('/favorites-saves', getFavoritesSavesList); // Get combined favorites and saves
router.get('/search', searchExercises); // search/filter exercise

router.get('/:exerciseId', getExerciseById); // Get single exercise details
router.patch('/:exerciseId', updateExercise); // Update exercise
router.delete('/:exerciseId', deleteExercise); // Delete exercise


router.post('/:exerciseId/favorite', favoriteExercise); // Favorite an exercise
router.delete('/:exerciseId/favorite', unfavoriteExercise); // Unfavorite an exercise
router.post('/:exerciseId/reactivate', reactivateExercise); // Reactivate existing exercise
router.post('/:exerciseId/save', saveExercise); // Save an exercise
router.delete('/:exerciseId/save', unsaveExercise); // Unsave an exercise

router.post('/:exerciseId/rate', rateExercise); // Rate an exercise

router.get('/:exerciseId/users-who-favorited', getUsersWhoFavorited); // List users who favorited
router.get('/:exerciseId/users-who-saved', getUsersWhoSaved); // List users who saved

export default router;
