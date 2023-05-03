import postModel from '../models/Post.js';


// создаю статью
export const createPost = async (req, res) => {
   try {
      const doc = await new postModel({
         title: req.body.title,
         text: req.body.text,
         tags: req.body.tags,
         user: req.userId,
         imageUrl: req.body.imageUrl,
      });
      const post = await doc.save();
      res.json(post)
   } catch (err) {
      console.log(err)
      res.status(500).json({
         message: 'Не удалось создать статью'
      });
   }
};

// запрашиваю все статьи 
export const getAllPosts = async (req, res) => {
   try {
      const posts = await postModel.find().populate('user').exec();
      res.json(posts)
   } catch (err) {
      console.log(err)
      res.status(500).json({
         message: 'Не удалось получить статьи'
      });
   }
};