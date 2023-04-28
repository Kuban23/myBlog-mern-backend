import jwt from 'jsonwebtoken';

export default (req, res, next) => {
   const token = (req.headers.authorization).replace('Bearer ', '');
   if (token) {
       try {
         const decodered = jwt.verify(token, 'secret123');
         req.userId = decodered._id

      } catch (error) {
         return res.status(403).json({
            message: 'Нет доступа',
         });
      }
   }
   else {
      return res.status(403).json({
         message: 'Нет доступа',
      });
   }
   next()
};