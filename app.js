import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validation/auth.js';
import { validationResult } from 'express-validator';
import userModel from './models/user.js';
import bcrypt from 'bcrypt';

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
app.post('/auth/register', registerValidation, async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json(errors.array());
      }

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new userModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash,
      });
      const user = await doc.save();

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );
      const { passwordHash, ...userData } = user._doc;
      res.json({
         ...userData,
         token,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось зарегистрироваться',
      });
   }
});

// Запрос на авторизацию
app.post('/auth/login', async (req, res) => {
   try {
      const user = await userModel.findOne({
         email: req.body.email,
      });
      if (!user) {
         return res.status(404).json({
            message: 'Такого пользователя не существует'
         })
      };
      const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
      if (!isValidPassword) {
         return res.status(400).json({
            message: 'Не верный логин или пароль'
         })
      };
      const token = jwt.sign(
         {
            _id: user._id
         },
         'secret123',
         {
            expiresIn: '30d',
         }
      );
      const { passwordHash, ...userData } = user._doc;
      res.json({
         ...userData,
         token
      })
   }
   catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось зарегистрироваться',
      });
   }
});