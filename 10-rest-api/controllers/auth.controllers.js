import passport from 'passport';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/user.js';

export default {
  getLoginPage, login, getRegisterPage, signup, logout, getLogout
};

/* Pages */
async function getRegisterPage(req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  var apiPath = process.env.API_SERVER;

  res.render('signup', { title: 'Регистрация', apiPath });
}
async function getLoginPage(req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  var apiPath = process.env.API_SERVER;

  res.render('login', { title: 'Вход', apiPath });
}
async function getLogout(req, res) {
  res.clearCookie('token').redirect('/');
}

/* API */
async function signup(req, res) {
  res.sendStatus(201);
}
async function login(req, res, next) {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.');

          return next(error);
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { id: user._id };
            const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

            return res.status(200).cookie('token', token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true
              }).end();
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}
async function logout(req, res, next) {
  res.clearCookie('token').end();
}
