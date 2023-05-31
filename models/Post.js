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
         ref: 'Myuser',
         required: true,
      },

      imageUrl: String,
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('Post', PostSchema);