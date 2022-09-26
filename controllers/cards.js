const Card = require('../models/card');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

module.exports.checkCardOwner = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card && card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }
      next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findOneAndRemove({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Невалидный _id карточки'));
      }
      return next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Невалидный _id карточки'));
      }
      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Невалидный _id карточки'));
      }
      return next(error);
    });
};
