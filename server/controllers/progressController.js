const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Update progress
// @route   POST /api/progress/update
// @access  Private
const updateProgress = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user._id;

  let progress = await Progress.findOne({ userId, courseId });
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return;
  }

  if (!progress) {
    progress = new Progress({
      userId,
      courseId,
      completedLessons: [lessonId]
    });
  } else {
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
  }

  // Calculate percentage
  const totalLessons = course.lessons.length;
  const completedCount = progress.completedLessons.length;
  progress.progressPercentage = Math.round((completedCount / totalLessons) * 100);

  if (progress.progressPercentage === 100) {
    progress.isCourseCompleted = true;
  }

  const updatedProgress = await progress.save();
  res.json(updatedProgress);
};

// @desc    Get progress for user
// @route   GET /api/progress/:userId
// @access  Private
const getProgress = async (req, res) => {
  const progress = await Progress.find({ userId: req.params.userId }).populate('courseId', 'title thumbnail');
  res.json(progress);
};

module.exports = { updateProgress, getProgress };
