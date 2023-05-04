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

// запрашиваю одну статью
export const getOnePost = (req, res) => {
   const postId = req.params.id;
   postModel.findByIdAndUpdate(
      {
         _id: postId,
      },
      {
         $inc: { viewsCount: 1 }
      },
      {
         returnDocument: 'after',
      },
   )
      .then((doc) => {
         if (!doc) {
            return res.status(404).json({
               message: 'Статья не найдена'
            });
         }

         res.json(doc);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: 'Не удалось получить статью'
         });
      });
};

// удаляю статью
export const removePost = (req, res) => {
   const postId = req.params.id;
   postModel.findByIdAndDelete(
      {
         _id: postId
      },
   )
      .then((doc) => {
         if (!doc) {
            return res.status(404).json({
               message: 'Статья не найдена'
            });
         }
         res.json({
            message: 'Статья удалена',
         })
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({
            message: 'Не удалось получить статью'
         });
      });
};