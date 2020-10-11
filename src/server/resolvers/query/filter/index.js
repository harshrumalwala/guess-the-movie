const _ = require('lodash');

const isPersonInCast = async (parents, args, context) => {

  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        cast: {
          some: {
            name: {
              equals: args.person
            }
          }
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })
  return _.size(movies) > 0;
}

const isDirectedBy = async (parents, args, context) => {

  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        director: {
          name: {
            equals: args.person
          }
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })
  return _.size(movies) > 0;
}

const isBoxOfficeCollectionGreaterThan = async (parents, args, context) => {

  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        boxOffice: {
          gte: args.boxOffice
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })

  return _.size(movies) > 0;
}

const isReleasedAfter = async (parents, args, context) => {
  console.log(args.releaseDate);
  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        releaseDate: {
          gte: new Date(args.releaseDate)
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })

  return _.size(movies) > 0;
}

const isGenre = async (parents, args, context) => {

  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        genre: {
          some: {
            name: {
              equals: args.genre
            }
          }
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })
  return _.size(movies) > 0;
}

const isPrimaryLanguage = async (parents, args, context) => {

  const movies = await context.prisma.movie.findMany({
    where: {
      AND: [{
        language: {
          name: {
            equals: args.language
          }
        },
        id: {
          equals: args.id,
        },
      }],
    },
  })
  return _.size(movies) > 0;
}

module.exports = {
  isPersonInCast,
  isDirectedBy,
  isBoxOfficeCollectionGreaterThan,
  isReleasedAfter,
  isGenre,
  isPrimaryLanguage
}