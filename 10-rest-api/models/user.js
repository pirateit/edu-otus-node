import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var { Schema } = mongoose;

var userSchema = new Schema({
  email: {
    type: String,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

userSchema.pre('save', async function hashPassword(next) {
    var user = this;
    var hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

userSchema.post('save', function (err, doc, next) {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    next(new Error('Данный E-mail уже зарегистрирован'));
  } else {
    next(err);
  }
});

userSchema.methods.isValidPassword = async function isValidPassword(password) {
  var user = this;
  var compare = await bcrypt.compare(password, user.password);

  return compare;
}

var User = mongoose.model('User', userSchema);

export default User;
