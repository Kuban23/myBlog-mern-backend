import express from 'express';
import mongoose from 'mongoose';
import { loginValidation, registerValidation } from './validation/validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { postCreateValidation } from './validation/validations.js';
import { createPost, getAllPosts, getOnePost, removePost, updatePost } from './controllers/PostController.js';


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

// роут на регистрацию 
app.post('/auth/register', registerValidation, register);

// роут на авторизацию
app.post('/auth/login', loginValidation, login);


// роут на получение своих данных
app.get('/auth/me', checkAuth, getMe);

// роут создания статьи
app.post('/posts', checkAuth, postCreateValidation, createPost);

// роут для запоса всех статей
app.get('/posts', getAllPosts);

// роут для запроса одной статьи
app.get('/posts/:id', getOnePost);

// роут для удаления статьи
app.delete('/posts/:id', checkAuth, removePost);

// роут для редактирования статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, updatePost);