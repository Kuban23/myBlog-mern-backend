import {body} from 'express-validator';

// валидирую данные пользователя при регистрации
export const registerValidation=[ 
   body('email','Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум из 5 символов').isLength({min:5}),
   body('fullName', 'Укажите имя').isLength({min:3}),
	body('avatar', 'Неверная ссылка на аватарку').optional().isURL(),
];

// валидирую данные пользователя при авторизации
export const loginValidation = [
   body('email', 'Неверный формат почты').isEmail(),
   body('password', 'Папроль должен быть минимум 5 символов').isLength({ min: 5 }),
 ];
 
 // валидирую статьи
 export const postCreateValidation = [
   body('title', 'Ведите заголовок статьи').isLength({ min: 3 }).isString(),
   body('text', 'Ведите текст статьи').isLength({ min: 3 }).isString(),
   body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
   body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
 ];
 