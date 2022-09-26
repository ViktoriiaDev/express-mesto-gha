const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const app = express();

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    autoIndex: true,
    autoCreate: true,
  },
  (error) => {
    if (!error) {
      console.log('mongoose connected');
    }
  },
);

app.use(bodyParser.json());
// регистрация и логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use('/', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(errors());

// это обработчик ошибки
app.use((error, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500;
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(3000);
