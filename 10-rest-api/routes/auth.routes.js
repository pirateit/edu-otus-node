import express from 'express';
import passport from 'passport';
import authControllers from '../controllers/auth.controllers.js';
import checkAuthed from '../middleware/passport.js';

var router = express.Router();

/* Pages */
router.get('/signup', checkAuthed, authControllers.getRegisterPage);
router.get('/login', authControllers.getLoginPage);
router.get('/logout', authControllers.getLogout)

/* API */
router.post('/api/auth/signup', passport.authenticate('signup', { session: false }), authControllers.signup);
router.post('/api/auth/login', authControllers.login);
router.post('/api/auth/logout', passport.authenticate('signup', { session: false }), authControllers.logout);

export default router;
