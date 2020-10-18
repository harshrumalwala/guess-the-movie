const {
  includeNestedMovieAttributes,
  includeNestedRoomAttributes,
  includeNestedUserAttributes
} = require('../../../util');

const movies = async (parents, args, context) =>
  await context.prisma.movie.findMany({
    include: includeNestedMovieAttributes()
  });

const persons = async (parents, args, context) =>
  await context.prisma.person.findMany({
    include: {
      acted: true,
      directed: true
    }
  });

const directors = async (parents, args, context) =>
  await context.prisma.person.findMany({
    where: {
      directed: {
        some: {
          id: {
            not: null
          }
        }
      }
    }
  });

const cast = async (parents, args, context) =>
  await context.prisma.person.findMany({
    where: {
      acted: {
        some: {
          id: {
            not: null
          }
        }
      }
    }
  });

const genres = async (parents, args, context) =>
  await context.prisma.genre.findMany({
    include: {
      movies: true
    }
  });

const languages = async (parents, args, context) =>
  await context.prisma.language.findMany({
    include: {
      movies: true
    }
  });

const users = async (parents, args, context) =>
  await context.prisma.user.findMany({
    include: includeNestedUserAttributes()
  });

const rooms = async (parents, args, context) =>
  await context.prisma.room.findMany({
    include: includeNestedRoomAttributes()
  });

module.exports = {
  movies,
  persons,
  directors,
  cast,
  genres,
  languages,
  users,
  rooms
};
