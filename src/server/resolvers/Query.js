const movies = async (parents, args, context) =>
  await context.prisma.movie.findMany({
    include: {
      director: true,
      cast: true,
      genre: true
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
    },
  })

const persons = async (parents, args, context) =>
  await context.prisma.person.findMany({
    include: {
      acted: true,
      directed: true,
    },
  })

const person = async (parent, args, context) =>
  await context.prisma.person.findOne({
    where: {
      id: args.id,
    },
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

const genre = async (parent, args, context) =>
  await context.prisma.genre.findOne({
    where: {
      id: args.id,
    },
    include: {
      movies: true,
    },
  })


module.exports = {
  movies,
  persons,
  genres,
  movie,
  person,
  genre
}