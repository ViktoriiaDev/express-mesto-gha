const Card = require('../models/card');
const {
  incorrectDataError,
  dataNotFoundError,
  serverError,
} = require('../respons-statuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res
        .status(serverError)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, likes } = req.body;
  const { _id } = req.user;
  Card.create({
    name,
    link,
    likes,
    owner: _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(incorrectDataError).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOneAndRemove({ _id: cardId })
    .orFail(() => {
      throw new Error('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(incorrectDataError)
          .send({ message: 'Невалидный _id не найдена' });
      } else if (error.name === 'Error') {
        res.status(dataNotFoundError).send({
          message: error.message,
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(incorrectDataError)
          .send({ message: 'Невалидный _id карточки' });
      } else if (error.name === 'Error') {
        res.status(dataNotFoundError).send({
          message: error.message,
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(incorrectDataError)
          .send({ message: 'Невалидный _id карточки' });
      } else if (error.name === 'Error') {
        res.status(dataNotFoundError).send({
          message: error.message,
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
