import passport from "passport";

export default checkAuthed;

async function checkAuthed(req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    if (user && !req.user) {
      req.user = { ...user };
    }

    next();
  })(req, res, next)
}
