const Card = require("../models/card");
const { incorrectDataError, dataNotFoundError, serverError } = require("../respons-statuses");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные при получении карточки'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, likes } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, likes, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные при создании карточки'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOneAndRemove({ _id: cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let message = err.message;
      if (err.status === dataNotFoundError) {
        message = 'Карточка с указанным _id не найдена'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные для постановки лайка'
      }
      if (err.status === dataNotFoundError) {
        message = 'Передан несуществующий _id карточки'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let message = err.message;
      if (err.status === incorrectDataError) {
        message = 'Переданы некорректные данные для снятия лайка'
      }
      if (err.status === dataNotFoundError) {
        message = 'Передан несуществующий _id карточки'
      }
      if (err.status === serverError) {
        message = 'На сервере произошла ошибка'
      }
      res.status(err.status).send({ message })
    });
};
