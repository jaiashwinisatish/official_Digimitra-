const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  const { title, description, category, thumbnail, lessons } = req.body;

  const course = new Course({
    title,
    description,
    category,
    thumbnail,
    lessons: lessons || []
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

const enrollCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const user = req.user;

  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return;
  }

  if (user.enrolledCourses.includes(course._id)) {
    res.status(400).json({ message: 'Already enrolled in this course' });
    return;
  }

  user.enrolledCourses.push(course._id);
  await user.save();

  // Initialize progress
  const progress = new Progress({
    userId: user._id,
    courseId: course._id,
    completedLessons: [],
    progressPercentage: 0
  });
  await progress.save();

  res.status(200).json({ message: 'Successfully enrolled' });
};

const updateLessonSummary = async (req, res) => {
  try {
    const { summary } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    lesson.summary = summary;
    await course.save();

    res.json({ message: 'Summary updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, enrollCourse, updateLessonSummary };
