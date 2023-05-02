import express from 'express';
import mongoose from 'mongoose';
import { loginValidation, registerValidation } from './validation/validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';


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

// запрос на регистрацию 
app.post('/auth/register', registerValidation, register );

// Запрос на авторизацию
app.post('/auth/login', loginValidation, login);


// Запрос своих данных
app.get('/auth/me', checkAuth, getMe);