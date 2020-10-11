const {
  addMovie,
  updateMovie,
  deleteMovie,
} = require('./movie')

const {
  login,
  updateUser,
  deleteUser
} = require('./user')

const {
  createRoom,
  updateRoom,
  deleteRoom
} = require('./room')

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  login,
  updateUser,
  deleteUser,
  createRoom,
  updateRoom,
  deleteRoom
}