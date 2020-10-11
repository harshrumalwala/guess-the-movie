const _ = require("lodash");
const {
  includeNestedMovieAttributes,
} = require('../../../util');

const addMovie = async (parent, args, context) => {
  const newMovie = await context.prisma.movie.create({
    data: {
      name: args.name,
      director: {
        connectOrCreate: {
          where: {
            name: args.director.name
          },
          create: {
            name: args.director.name
          }
        }
      },
      genre: {
        connectOrCreate: _.map(args.genre, g => ({
          where: {
            name: g.name
          },
          create: {
            name: g.name
          }
        }))
      },
      language: {
        connectOrCreate: {
          where: {
            name: args.language.name
          },
          create: {
            name: args.language.name
          }
        }
      },
      cast: {
        connectOrCreate: _.map(args.cast, person => ({
          where: {
            name: person.name
          },
          create: {
            name: person.name
          }
        }))
      },
      releaseDate: new Date(args.releaseDate),
      boxOffice: args.boxOffice,
    },
    include: includeNestedMovieAttributes()
  });
  return newMovie;
}

const updateMovie = async (parent, args, context) => {
  const updatedData = _.assign({},
    args.name && {
      name: args.name,
    },
    args.director && {
      director: {
        connectOrCreate: {
          where: {
            name: args.director.name
          },
          create: {
            name: args.director.name
          }
        }
      }
    },
    args.language && {
      language: {
        connectOrCreate: {
          where: {
            name: args.language.name
          },
          create: {
            name: args.language.name
          }
        }
      },
    },
    args.cast && {
      cast: {
        connectOrCreate: _.map(args.cast, person => ({
          where: {
            name: person.name
          },
          create: {
            name: person.name
          }
        }))
      }
    },
    args.genre && {
      genre: {
        connectOrCreate: _.map(args.genre, g => ({
          where: {
            name: g.name
          },
          create: {
            name: g.name
          }
        }))
      }
    },
    args.releaseDate && {
      releaseDate: new Date(args.releaseDate),
    },
    args.boxOffice && {
      boxOffice: new Date(args.boxOffice),
    }
  );
  const updatedMovie = await context.prisma.movie.update({
    where: {
      id: args.id,
    },
    data: updatedData,
    include: includeNestedMovieAttributes()
  });
  return updatedMovie;
}

const deleteMovie = async (parent, args, context) => {
  const deletedMovie = await context.prisma.movie.delete({
    where: {
      id: args.id,
    },
    include: includeNestedMovieAttributes()
  });
  return deletedMovie;
}

module.exports = {
  addMovie,
  updateMovie,
  deleteMovie
}