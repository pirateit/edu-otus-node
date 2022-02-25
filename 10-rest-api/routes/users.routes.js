import express from 'express';
import passport from 'passport';
import usersControllers from '../controllers/users.controllers.js';
import checkAuthed from '../middleware/passport.js';

var router = express.Router();

/* Pages */
router.get('/my', checkAuthed, passport.authenticate('jwt', { session: false }), usersControllers.getUserPage);

/* API */
router.get('/api/users/search', passport.authenticate('jwt', { session: false }), usersControllers.searchUser);
router.get('/api/users/:id', passport.authenticate('jwt', { session: false }), usersControllers.getUser);

export default router;
