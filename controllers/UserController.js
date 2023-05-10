import { validationResult } from 'express-validator';
import userModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// запрос на регистрацию
export const register =async (req, res) => {
   try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //    return res.status(400).json(errors.array());
      // }

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
};

// Запрос на авториризацию
export const login =async (req, res) => {
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
};


//Запрашиваю информацию о себе
export const getMe =async (req, res) => {
   try {
      const user = await userModel.findById(req.userId);
      if (!user) {
         return res.status(404).json({
            message: 'Нет такого пользователя'
         });
      }
      const { passwordHash, ...userData } = user._doc
      res.json(
         userData
      );
   } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Нет доступа',
      });
   }
};