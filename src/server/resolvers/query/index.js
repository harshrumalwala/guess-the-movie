const {
  movies,
  persons,
  directors,
  cast,
  genres,
  languages,
  users,
  rooms
} = require("./findAll")

const {
  isPersonInCast,
  isDirectedBy,
  isBoxOfficeCollectionGreaterThan,
  isReleasedAfter,
  isGenre,
  isPrimaryLanguage,
} = require("./filter")

module.exports = {
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
  isPrimaryLanguage
}