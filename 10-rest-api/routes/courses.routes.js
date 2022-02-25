import express from 'express';
import passport from 'passport';
import * as fs from 'fs';
import multer from 'multer';
import coursesControllers from '../controllers/courses.controllers.js';
import checkAuthed from '../middleware/passport.js';

var router = express.Router();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var currentDate = new Date();
    var stringDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

    if (!fs.existsSync(`./uploads/attachments/${stringDate}`)) {
      fs.mkdirSync(`./uploads/attachments/${stringDate}`);
    }

    cb(null, `./uploads/attachments/${stringDate}`);
  },
  filename: function (req, file, cb) {
    var uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
var upload = multer({ storage });

router.get('/', checkAuthed, coursesControllers.getCoursesPage);
router.get('/courses/create', checkAuthed, coursesControllers.getCourseCreatePage);
router.get('/courses/:id', checkAuthed, coursesControllers.getCoursePage);
router.get('/courses/:id/edit', checkAuthed, passport.authenticate('jwt', { session: false }), coursesControllers.getCourseEditPage);
router.get('/courses/:id/lessons/:lid', checkAuthed, passport.authenticate('jwt', { session: false }), coursesControllers.getLessonPage);
router.get('/courses/:id/lessons/:lid/edit', checkAuthed, passport.authenticate('jwt', { session: false }), coursesControllers.getLessonEditPage);

router.get('/api/courses', coursesControllers.getCourses);
router.get('/api/courses/:id', coursesControllers.getCourse);
router.post('/api/courses', upload.none(), passport.authenticate('jwt', { session: false }), coursesControllers.createCourse);
router.put('/api/courses/:id', upload.none(), passport.authenticate('jwt', { session: false }), coursesControllers.updateCourse);
router.delete('/api/courses/:id', passport.authenticate('jwt', { session: false }), coursesControllers.deleteCourse);
router.get('/api/courses/:id/lessons/:lid', passport.authenticate('jwt', { session: false }), coursesControllers.getLesson);
router.put('/api/courses/:id/lessons/:lid', upload.array('attachments'), passport.authenticate('jwt', { session: false }), coursesControllers.updateLesson);

export default router;
