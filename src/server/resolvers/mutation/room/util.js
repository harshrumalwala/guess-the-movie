const _ = require('lodash')

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

const updateRoomOnGameRestart = (room, movies, isGameRestarted) => {
  if (isGameRestarted && room.host) {
    return _.assign({}, {
        round: 0,
        roundLimit: room.roundLimit,
        roundMovieId: null,
      }, !_.isEmpty(room.movies) && {
        movies: {
          disconnect: _.map(room.movies, movie => ({
            id: movie.id
          }))
        }
      },
      !_.isEmpty(room.roundCompleted) && {
        roundCompleted: {
          disconnect: _.map(room.roundCompleted, user => ({
            id: user.id
          }))
        }
      })
  }
  return {};
}

const updateRoomOnPlayerJoin = (room, userId) => isPlayerNew(userId, room) && {
  players: {
    connect: {
      id: userId
    }
  }
}

const updateRoomOnPlayerRoundComplete = (room, userId, hasCompletedRound) =>
  hasPlayerCompletedRound(hasCompletedRound, userId, room) && {
    roundCompleted: {
      connect: {
        id: userId
      }
    }
  }

module.exports = {
  isPlayerNew,
  hasPlayerCompletedRound,
  isRoundComplete,
  pickRandomMovie,
  updateRoomOnNewRound,
  updateRoomOnPlayerExit,
  updateRoomOnGameRestart,
  updateRoomOnPlayerJoin,
  updateRoomOnPlayerRoundComplete,
}