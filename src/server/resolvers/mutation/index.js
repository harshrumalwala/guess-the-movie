const {
  addMovie,
  updateMovie,
  deleteMovie,
} = require('./movie')

const {
  login,
  updateUser
} = require('./user')

const {
  createRoom,
  updateRoom
} = require('./room')

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  login,
  updateUser,
  createRoom,
  updateRoom
}