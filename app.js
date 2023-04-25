import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validation/auth.js';
import { validationResult } from 'express-validator';

mongoose.connect('mongodb://localhost:27017/admin2')
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

app.post('/auth/login', (req, res) => {
   console.log(req.body)
   const token = jwt.sign(
      {
         email: req.body.email,
         fullName: 'Вася Пупкин'
      },
      'secret123'
   )
   res.json(
      {
         "saccess": "true",
         token,
      }
   )
});

app.post('/auth/register', registerValidation,(req, res) => {
const errors=validationResult(req);
if(!errors.isEmpty()){
res.status(400).json(errors.array())
}
res.json({
   success:true
})
});