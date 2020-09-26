const movies = async (parents, args, context) =>
  await context.prisma.movie.findMany({
    include: {
      director: true,
      cast: true,
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
  await context.prisma.movie.findOne({
    where: {
      id: args.id,
    },
    include: {
      acted: true,
      directed: true,
    },
  })


module.exports = {
  movies,
  persons,
  movie,
  person
}