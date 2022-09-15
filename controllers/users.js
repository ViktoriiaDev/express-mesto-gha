const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = "Переданы некорректные данные при получении данных пользователя";
      }
      if (err.status === serverError) {
        message = "На сервере произошла ошибка";
      }
      res.status(err.status).send({ message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let message = err.message;
      if (err.status === dataNotFoundError) {
        message = 'Пользователь по указанному _id не найден'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = "Переданы некорректные данные при создании пользователя";
      }
      if (err.status === serverError) {
        message = "На сервере произошла ошибка";
      }
      res.status(err.status).send({ message });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные для обновлении профиля'
      }
      if (err.status === dataNotFoundError) {
        message = 'Пользователь с данным _id не найден'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные для обновлении аватара'
      }
      if (err.status === dataNotFoundError) {
        message = 'Пользователь с данным _id не найден'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};
