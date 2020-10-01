const movies = async (parents, args, context) =>
  await context.prisma.movie.findMany({
    include: {
      director: true,
      cast: true,
      genre: true,
      language: true,
    },
  })


const movie = async (parent, args, context) =>
  await context.prisma.movie.findOne({
    where: {
      id: args.id,
    },
    include: {
      director: true,
      cast: true,
      genre: true,
      language: true,
    },
  })

const persons = async (parents, args, context) =>
  await context.prisma.person.findMany({
    include: {
      acted: true,
      directed: true,
    },
  })

const genres = async (parents, args, context) =>
  await context.prisma.genre.findMany({
    include: {
      movies: true,
    },
  })

const languages = async (parents, args, context) =>
  await context.prisma.language.findMany({
    include: {
      movies: true,
    },
  })

const users = async (parents, args, context) =>
  await context.prisma.user.findMany({
    include: {
      host: true,
      participant: true,
      roundCompleted: true,
    },
  })

module.exports = {
  movies,
  persons,
  genres,
  languages,
  users,
  movie,
}