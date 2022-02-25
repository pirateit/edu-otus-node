import * as fs from 'fs';
import path from 'path';
import axios from 'axios';
import Course from '../models/course.js';

export default {
  createCourse, getLessonEditPage, getLessonPage, getLesson, updateLesson, deleteCourse, getCourse, getCourses, getCourseCreatePage, getCourseEditPage, getCoursePage, getCoursesPage, updateCourse
};

/* Pages */
async function getCoursesPage(req, res) {
  try {
    var courses = await axios.get(`${process.env.API_SERVER}/courses`);
  } catch (error) {
    console.error(error);
  }

  res.render('courses', { title: 'Курсы', user: req.user, courses: courses.data });
}
async function getCoursePage(req, res) {
  try {
    var courseData = await axios.get(`${process.env.API_SERVER}/courses/${req.params.id}`);
  } catch (error) {
    console.error(error);
  }

  if (courseData.data.access.find(user => user._id === req.user.id)._id) {
    courseData.data.hasAccess = true;
  }

  res.render('course', { title: courseData.data.title, user: req.user, course: courseData.data });
}
async function getCourseCreatePage(req, res) {
  var apiPath = process.env.API_SERVER;

  res.render('course-create', { title: 'Создание нового курса', user: req.user, apiPath });
}
async function getCourseEditPage(req, res) {
  var apiPath = process.env.API_SERVER;

  try {
    var courseData = await axios.get(`${apiPath}/courses/${req.params.id}`);
  } catch (error) {
    console.error(error);
  }

  if (courseData.data.author.id !== req.user.id) {
    return res.redirect('/');
  }

  res.render('course-edit', { title: 'Редактирование курса - ' + courseData.data.title, user: req.user, apiPath, course: courseData.data });
}
async function getLessonPage(req, res) {
  var apiPath = process.env.API_SERVER;
  var courseId = req.params.id;
  var lessonId = req.params.lid;

  try {
    var courseData = await axios.get(`${apiPath}/courses/${courseId}`, {
      headers: {
        Cookie: `token=${req.cookies['token']};`
      }
    });
  } catch (error) {
    console.error(error);
  }

  if (!courseData.data.access.find(user => user._id === req.user.id)._id) {
    return res.redirect('/');
  }

  try {
    var lessonData = await axios.get(`${apiPath}/courses/${courseId}/lessons/${lessonId}`, {
      headers: {
        Cookie: `token=${req.cookies['token']};`
      }
    });
  } catch (error) {
    console.error(error);
  }

  function YouTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
    return ID;
  }

  lessonData.data.video = YouTubeGetID(lessonData.data.video);

  res.render('lesson', { title: lessonData.data.title, user: req.user, apiPath, id: courseId, lesson: lessonData.data });
}
async function getLessonEditPage(req, res) {
  var apiPath = process.env.API_SERVER;
  var courseId = req.params.id;
  var lessonId = req.params.lid;

  try {
    var courseData = await axios.get(`${apiPath}/courses/${courseId}`, {
      headers: {
        Cookie: `token=${req.cookies['token']};`
      }
    });
  } catch (error) {
    console.error(error);
  }
  if (courseData.data.author.id !== req.user.id) {
    return res.redirect('/');
  }

  try {
    var lessonData = await axios.get(`${apiPath}/courses/${courseId}/lessons/${lessonId}`, {
      headers: {
        Cookie: `token=${req.cookies['token']};`
      }
    });
  } catch (error) {
    console.error(error);
  }

  res.render('lesson-edit', { title: 'Редактирование урока - ' + lessonData.data.title, user: req.user, apiPath, id: courseId, lesson: lessonData.data });
}

/* API */
async function getCourses(req, res) {
  var courses = await Course.find()
    .select('title description createdAt')
    .populate('author', 'firstName lastName');

  res.json(courses);
}
async function getCourse(req, res) {
  var courseData = await Course.findById(req.params.id)
    .populate('author', 'firstName lastName')
    .populate('access', 'email firstName lastName');

  var course = {
    id: courseData._id,
    title: courseData.title,
    author: {
      id: courseData.author._id,
      firstName: courseData.author.firstName,
      lastName: courseData.author.lastName
    },
    description: courseData.description,
    lessons: [ ...courseData.lessons ],
    access: [ ...courseData.access ]
  };

  res.json(course);
}
async function createCourse(req, res) {
  // req.files.forEach(file => {
  //   var lesson = Number(file.fieldname.split('-')[0]);

  //   if (!req.body.lessons[lesson].attachments) {
  //     req.body.lessons[lesson].attachments = [];
  //   }

  //   req.body.lessons[lesson].attachments.push({
  //     type: path.extname(file.path).substring(1),
  //     path: file.destination.substring(1) + '/' + file.filename
  //   });
  // });

  // req.body.lessons.forEach(lesson => {
  //   lesson.attachments = [];

  //   lesson.links.forEach(link => {
  //     lesson.attachments.push({
  //       type: 'link',
  //       path: link
  //     });
  //   });
  // });
  req.body.author = req.user.id;
  var course = new Course(req.body);

  await course.save();

  res.sendStatus(201);
}
async function updateCourse(req, res) {
  var courseId = req.params.id;
  var courseData = req.body;
  var course = await Course.findById(courseId);

  if (req.user.id !== course.author.toString()) {
    return res.sendStatus(401);
  }

  async function reorderLessons(lessons) {
    var newOrder = [];
    var attachmentsToRemove = [];

    lessons.forEach(lesson => {
      if (lesson.id) {
        newOrder.push(course.lessons.id(lesson.id))
      } else if (lesson.title) {
        newOrder.push({ title: lesson.title })
      }
    });

    // Remove files from deleted lessons
    course.lessons.forEach(lesson => {
      if (newOrder.find(less => less.id === lesson._id.toString())) {
        return;
      }

      attachmentsToRemove.push(...lesson.attachments)
    });

    attachmentsToRemove.forEach(att => {
      fs.rmSync(`./${att.path}`);
    });

    return newOrder;
  }

  if (!courseData.access) {
    courseData.access = [];
  }

  if (courseData.lessons) {
    courseData.lessons = await reorderLessons(courseData.lessons);
  }

  await Course.findOneAndUpdate({ _id: courseId }, courseData);

  res.sendStatus(204);
}
async function deleteCourse(req, res) {
  var courseData = await Course.findById(req.params.id, 'author');

  if (req.user.id !== courseData.author.toString()) {
    return res.sendStatus(401);
  }

  // TODO: Function to remove attachment files from course lessons

  await Course.findByIdAndRemove(req.params.id);

  res.sendStatus(200);
}
async function getLesson(req, res) {
  var courseData = await Course.findById(req.params.id);
  var lessonData = courseData.lessons.id(req.params.lid);

  var resLesson = {
    id: lessonData._id,
    title: lessonData.title,
    description: lessonData.description,
    video: lessonData.video,
    attachments: [...lessonData.attachments],
    comments: [...lessonData.comments]
  };

  res.json(resLesson);
}
async function updateLesson(req, res) {
  var newLessonData = req.body;

  if (!newLessonData.attachments) {
    newLessonData.attachments = [];
  }

  req.files.forEach(file => {
    newLessonData.attachments.push({
      type: path.extname(file.path).substring(1),
      path: file.destination.substring(1) + '/' + file.filename
    });
  });

  if (newLessonData.links && Array.isArray(newLessonData.links)) {
    newLessonData.links.forEach(link => {
      newLessonData.attachments.push({
        type: 'link',
        path: link
      });
    });
  } else if (newLessonData.links) {
    newLessonData.attachments.push({
      type: 'link',
      path: newLessonData.links
    });
  }

  await Course.findById(req.params.id)
    .then((course) => {
      var lesson = course.lessons.id(newLessonData.lid);

      lesson.set(newLessonData);

      return course.save();
    });

  res.sendStatus(204);
}
