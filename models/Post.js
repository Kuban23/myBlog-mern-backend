import mongoose from 'mongoose';

// описываю модель пользователя
const PostSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      text: {
         type: String,
         requared: true,
         unique: true,
      },
      tags: {
         type: Array,
         default: [],
      },
      viewsCount: {
         type: Number,
         default: 0,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
         required: true,
      },

      imageUrl: String,
   },
   {
      timestamp: true,
   },
);

export default mongoose.model('Post', PostSchema);