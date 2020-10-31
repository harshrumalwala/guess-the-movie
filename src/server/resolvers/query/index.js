const {
  movie,
  movies,
  persons,
  directors,
  cast,
  genres,
  languages,
  users,
  rooms
} = require('./findAll');

const {
  isPersonInCast,
  isDirectedBy,
  isBoxOfficeCollectionGreaterThan,
  isReleasedAfter,
  isGenre,
  isPrimaryLanguage,
  isMovie
} = require('./filter');

module.exports = {
  movie,
  movies,
  persons,
  directors,
  cast,
  genres,
  languages,
  users,
  rooms,
  isPersonInCast,
  isDirectedBy,
  isBoxOfficeCollectionGreaterThan,
  isReleasedAfter,
  isGenre,
  isPrimaryLanguage,
  isMovie
};
