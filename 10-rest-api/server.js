import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import helmet from 'helmet';
import mongoose from 'mongoose';
import './config/passport.js';

import authRouter from './routes/auth.routes.js';
import coursesRouter from './routes/courses.routes.js';
import usersRouter from './routes/users.routes.js';

var app = express();

mongoose.connect(process.env.MONGO_DB);

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(helmet());

app.use(authRouter);
app.use(coursesRouter);
app.use(usersRouter);

app.listen(3000, () => {
  console.log('Server successfully started')
})
;
