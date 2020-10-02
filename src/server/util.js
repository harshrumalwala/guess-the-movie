const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'
const _ = require('lodash')

const getUserId = (context) => {
  const authorization = context.request.get('Authorization');
  if (authorization && !_.isEmpty(retrieveUserToken(authorization))) {
    const token = retrieveUserToken(authorization);
    const {
      userId
    } = jwt.verify(token, APP_SECRET);
    return userId;
  }
  throw new Error('User is not authenticated');
}

const retrieveUserToken = (authorization) =>
  _.chain(authorization).replace('Bearer', '').trim().value();

const isPlayerNew = (userId, room) =>
  room.round === 0 && _.isEmpty(_.filter(room.players, ['id', userId]));

const hasPlayerCompletedRound = (hasCompletedRound, userId, room) =>
  hasCompletedRound && _.isEmpty(_.filter(room.roundCompleted, ['id', userId]))

const isRoundComplete = (room) => _.size(room.players) === _.size(room.roundCompleted)

const pickRandomMovie = (movies, previousRoundMovies) => {
  const previousRoundMovieIds = _.map(previousRoundMovies, 'id');
  const newMovieList = _.filter(movies, movie => !_.includes(previousRoundMovieIds, movie.id));
  return _.size(newMovieList) > 0 ?
    newMovieList[_.random(_.size(newMovieList) - 1)] :
    movies[_.random(_.size(movies) - 1)];
}

const updateRoomOnNewRound = (room, movies, isGameReady) => {
  if (isGameReady || (isRoundComplete(room) && room.round < room.roundLimit)) {
    const newMovie = pickRandomMovie(movies, room.movies);
    return _.assign({}, {
      round: room.round + 1,
      roundMovieId: newMovie.id,
      movies: {
        connect: {
          id: newMovie.id
        }
      }
    }, !_.isEmpty(room.roundCompleted) && {
      roundCompleted: {
        disconnect: _.map(room.roundCompleted, user => ({
          id: user.id
        }))
      }
    })
  }
  return {};
}

const updateRoomOnPlayerExit = (room, userId, hasPlayerLeft) => {
  if (hasPlayerLeft) {
    return _.assign({
      players: {
        disconnect: {
          id: userId
        }
      }
    }, !_.isEmpty(_.filter(room.roundCompleted, ['id', userId])) && {
      roundCompleted: {
        disconnect: {
          id: userId
        }
      }
    }, room.host.id === userId && {
      host: {
        disconnect: true
      }
    })
  }
  return {};
}

const includeNestedRoomAttributes = () => ({
  language: true,
  host: true,
  players: true,
  roundCompleted: true,
  movies: true
})

const includeNestedMovieAttributes = () => ({
  director: true,
  cast: true,
  genre: true,
  language: true,
  rooms: true
})

const includeNestedUserAttributes = () => ({
  host: true,
  participant: true,
  roundCompleted: true,
})

module.exports = {
  getUserId,
  isPlayerNew,
  hasPlayerCompletedRound,
  isRoundComplete,
  pickRandomMovie,
  updateRoomOnNewRound,
  updateRoomOnPlayerExit,
  includeNestedMovieAttributes,
  includeNestedRoomAttributes,
  includeNestedUserAttributes,
  APP_SECRET
}