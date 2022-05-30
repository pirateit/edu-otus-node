import passport from 'passport';

export default checkAuthenticated;

async function checkAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) console.log(err);

    if (user && !req.user) {
      req.user = { ...user };
    }

    next();
  })(req, res, next)
}
