const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    mr: { type: String, required: true }
  },
  videoUrl: { type: String, required: true },
  duration: { type: String, required: true },
  order: { type: Number, required: true },
  summary: { type: String },
  unitNumber: { type: Number },
  lessonNumber: { type: Number },
  durationSeconds: { type: Number },
  driveUrl: { type: String }
});

const assignmentSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    mr: { type: String, required: true }
  },
  options: [{
    en: { type: String, required: true },
    mr: { type: String, required: true }
  }],
  correctAnswer: { type: Number, required: true } // Index of options
});

const courseSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    mr: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    mr: { type: String, required: true }
  },
  category: {
    en: { type: String, required: true },
    mr: { type: String, required: true }
  },
  level: {
    en: { type: String, default: 'Beginner' },
    mr: { type: String, default: 'नवशिक्या' }
  },
  hours: {
    type: Number,
    default: 10
  },
  thumbnail: { type: String, required: true },
  lessons: [lessonSchema],
  assignments: [assignmentSchema]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
