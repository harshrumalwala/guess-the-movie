const _ = require("lodash");

async function add(parent, args, context) {
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
        connectOrCreate: {
          where: {
            name: args.genre.name
          },
          create: {
            name: args.genre.name
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
    },
    include: {
      director: true,
      cast: true,
      genre: true,
    }
  });
  return newMovie;
}

async function update(parent, args, context) {
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
    args.genre && {
      genre: {
        connectOrCreate: {
          where: {
            name: args.genre.name
          },
          create: {
            name: args.genre.name
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
    args.releaseDate && {
      releaseDate: new Date(args.releaseDate),
    }
  );
  const updatedMovie = await context.prisma.movie.update({
    where: {
      id: args.id,
    },
    data: updatedData,
    include: {
      director: true,
      cast: true,
      genre: true
    }
  });
  return updatedMovie;
}

async function remove(parent, args, context) {
  const deletedMovie = await context.prisma.movie.delete({
    where: {
      id: args.id,
    },
    include: {
      director: true,
      cast: true,
      genre: true
    }
  });
  return deletedMovie;
}

module.exports = {
  add,
  update,
  remove
}