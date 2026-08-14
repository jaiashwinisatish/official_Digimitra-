const express = require('express');
const { getCourses, getCourseById, createCourse, enrollCourse, updateLessonSummary } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, admin, createCourse);

router.post('/:id/enroll', protect, enrollCourse);

router.route('/:id')
  .get(getCourseById);

router.get('/:id/lessons', getCourseById); // Reusing getCourseById as it returns lessons

router.route('/:id/lessons/:lessonId/summary')
  .put(protect, updateLessonSummary);

module.exports = router;
