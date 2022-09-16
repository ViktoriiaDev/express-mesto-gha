const User = require('../models/user');
const {
  incorrectDataError,
  dataNotFoundError,
  serverError,
} = require('../respons-statuses');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(incorrectDataError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(incorrectDataError)
          .send({
            message: 'Переданы некорректные данные для получения пользователя',
          });
      } else if (error.name === 'Error') {
        res
          .status(dataNotFoundError)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(incorrectDataError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate(
    { _id },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('Пользователь с данным _id не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'Error') {
        res
          .status(dataNotFoundError)
          .send({ message: 'Пользователь с данным _id не найден' });
      } else if (error.name === 'ValidationError') {
        res
          .status(incorrectDataError)
          .send({
            message: 'Переданы некорректные данные при обновлении пользователя',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('Пользователь с данным _id не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'Error') {
        res
          .status(dataNotFoundError)
          .send({ message: 'Пользователь с данным _id не найден' });
      } else if (error.name === 'ValidationError') {
        res
          .status(incorrectDataError)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
