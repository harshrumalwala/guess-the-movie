const { GraphQLServer } = require("graphql-yoga");
const _ = require("lodash");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    movies: async (parents, args, context) =>
      await context.prisma.movie.findMany(),
    movie: async (parent, args, context) =>
      await context.prisma.movie.findOne({
        where: {
          id: args.id,
        },
      }),
  },
  Mutation: {
    add: async (parent, args, context) => {
      const newMovie = await context.prisma.movie.create({
        data: {
          name: args.name,
          director: args.director,
          genre: args.genre,
          actors: args.actors,
          actresses: args.actresses,
          releaseDate: new Date(args.releaseDate),
        },
      });
      return newMovie;
    },
    update: async (parent, args, context) => {
      const updatedData = _.assign(
        {},
        args.name && {
          name: args.name,
        },
        args.director && {
          director: args.director,
        },
        args.genre && {
          genre: args.genre,
        },
        args.actors && {
          actors: args.actors,
        },
        args.actresses && {
          actresses: args.actresses,
        },
        args.releaseDate && {
          releaseDate: new Date(args.releaseDate),
        }
      );
      console.log(args.releaseDate, new Date(args.releaseDate));
      const updatedMovie = await context.prisma.movie.update({
        where: {
          id: args.id,
        },
        data: updatedData,
      });
      return updatedMovie;
    },
    delete: async (parent, args, context) => {
      const deletedMovie = await context.prisma.movie.delete({
        where: {
          id: args.id,
        },
      });
      return deletedMovie;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/server/schema.graphql",
  resolvers,
  context: {
    prisma,
  },
});

server.start(() => console.log("Server is running at http://localhost:4000"));
