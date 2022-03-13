import axios from 'axios';
import Course from '../models/course.js';
import User from '../models/user.js';

export default {
  getUserPage, getUser, searchUser
};

/* Pages */
async function getUserPage(req, res) {
  try {
    var user = await axios.get(`${process.env.API_SERVER}/users/${req.user.id}`, {
      headers: {
        Cookie: `token=${req.cookies['token']};`
      }
    });
  } catch (error) {
    console.error(error);
  }

  res.render('my', { title: 'Мой кабинет', user: user.data });
}

/* API */
async function searchUser(req, res) {
  var searchByEmail = req.query.email;
  var userData = await User.findOne({ email: searchByEmail.trim() }, 'email firstName lastName');
  var user = {
    id: userData._id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName
  };

  res.status(200).json(user);
}
async function getUser(req, res) {
  var userData = await User.findById(req.user.id);
  var userCoursesData = await Course.find({ access: req.user.id }, 'title description author')
    .populate('author', 'firstName lastName');
  var userCourses = userCoursesData.map(courseData => {
    return {
      id: courseData._id,
      title: courseData.title,
      description: courseData.description,
      author: courseData.author
    };
  });
  var userCoursesOwnerData = await Course.find({ author: req.user.id });
  var userCoursesOwner = userCoursesOwnerData.map(courseData => {
    return {
      id: courseData._id,
      title: courseData.title,
      description: courseData.description
    };
  });
  var user = {
    id: userData._id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    courses: [ ...userCourses ],
    coursesOwner: [ ...userCoursesOwner ]
  }

  res.status(200).json(user);
}
