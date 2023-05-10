import { validationResult } from 'express-validator';

export default (req, res, next) => {
   // Проверяю есть ли ошибки в запросе, в этом поможет ф-я validationResult
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }
   next();
};