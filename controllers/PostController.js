import postModel from '../models/Post.js';


// создаю статью user
export const createPost = async (req, res) => {
   try {
      const doc = await new postModel({
         title: req.body.title,
         text: req.body.text,
         tags: req.body.tags.split(','),
         // tags: req.body.tags,
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
   .populate('user')
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

// редактирую статью
export const updatePost = async (req, res) => {
   try {
      const postId = req.params.id;

      await postModel.updateOne(
         {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl,
         }
      );
      res.json({
         message: 'Статья отредактирована'
      })
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось отредактировать статью'
      });
   }
};

// Получаю тэги
export const getLastTags = async (req, res) => {
   try {
      // Объясняем, что хотим получить последние 3 статьи и возьмем их тэги.
      const posts = await postModel.find().limit(5).exec();
      // Когда получили список 3-х статей, берем их и мапим их, берем каждый объект вытаскиваем его статьи flat(), когда мы сделали flat()
      // мы должный взять последние 3 статьи,  далее передаем exec()- т.е. выполни наш запрос.
      const tags = posts
         .map((obj) => obj.tags)
         .flat()
         .slice(0, 5);
      // возвращаю ответ
      res.json(tags);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить тэги',
      });
   }
};