import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, registerValidation } from './validation/validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { postCreateValidation } from './validation/validations.js';
import { createPost, getAllPosts, getOnePost, removePost, updatePost } from './controllers/PostController.js';
import handleValidationError from './utils/handleValidationError.js';

mongoose.connect('mongodb://localhost:27017/blog')
   .then(() => console.log('BD-ok'))
   .catch((err) => console.log('BD err', err))

const app = express();

app.get('/', (req, res) => {
   res.send('Привет!')
});

app.listen(4444, (err) => {
   if (err) {
      return console.log(err)
   }
   console.log('Server OK')
});

app.use(express.json())
app.use(cors());
//создаю хранилище где будут храниться картинки
const storage = multer.diskStorage(
   {
      destination: (_, __, cb) => {
         cb(null, 'uploads');
      },
      filename: (_, file, cb) => {
         cb(null, file.originalname);
      },
   },
);

// Применяю логику хранилища на expresse
const upload = multer({ storage });

// роут на регистрацию 
app.post('/auth/register', registerValidation, handleValidationError, register);

// роут на авторизацию
app.post('/auth/login', loginValidation, handleValidationError, login);


// роут на получение своих данных
app.get('/auth/me', checkAuth, getMe);

// роут создания статьи
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, createPost);

// роут для запоса всех статей
app.get('/posts', getAllPosts);

// роут для запроса одной статьи
app.get('/posts/:id', getOnePost);

// роут для удаления статьи
app.delete('/posts/:id', checkAuth, removePost);

// роут для редактирования статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, updatePost);

// Создал роут для загрузки файла.
app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   });
});

//Решение вопроса, чтобы картинка отображалась в браузере
app.use('/uploads', express.static('uploads'));