import mongoose from 'mongoose';

var { Schema } = mongoose;

var lessonSchema = new Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  video: { type: String, trim: true, required: true },
  attachments: [{
    type: { type: String, default: 'other' },
    path: { type: String }
  }],
  comments: [{
    text: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }]
});

var courseSchema = new Schema({
  title: { type: String, trim: true, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  lessons: [ lessonSchema ],
  access: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

var Course = mongoose.model('Course', courseSchema);

export default Course;
