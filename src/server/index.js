const {
  GraphQLServer
} = require("graphql-yoga");
const _ = require("lodash");

const MOVIES = [{
    name: "The Avengers",
    director: ["Joss Whedon"],
    genre: "Action",
    releaseDate: 1335484800,
    actors: ["Robert Downey Jr, Chris Evans, Mark Ruffalo, Chris Hemsworth"],
    actresses: ["Scarlett Johansson"],
  },
  {
    name: "Creed",
    director: ["Ryan Coogler"],
    genre: "Action",
    releaseDate: 1448582400,
    actors: ["Michael B. Jordan, Sylvester Stallone"],
    actresses: ["Tessa Thompson"],
  },
];

const mapMovie = (movie, id) =>
  movie && {
    id,
    ...movie,
  };

let newId = MOVIES.length;
const resolvers = {
  Query: {
    movies: () => _.map(MOVIES, mapMovie),
    movie: ({
      id
    }) => mapMovie(MOVIES[id], id),
  },
  Mutation: {
    add: (parent, args) => {
      const newMovie = {
        id: newId++,
        name: args.name,
        director: args.director,
        genre: args.genre,
        actors: args.actors,
        actresses: args.actresses,
        releaseDate: args.releaseDate
      }
      MOVIES.push(newMovie);
      return newMovie;
    },
    update: (parent, args) => {
      if (MOVIES[args.id]) {
        const updatedParams = _.assign({},
          args.name && {
            name: args.name
          }, args.director && {
            director: args.director
          }, args.genre && {
            genre: args.genre
          }, args.actors && {
            actors: args.actors
          }, args.actresses && {
            actresses: args.actresses
          }, args.releaseDate && {
            releaseDate: args.releaseDate
          }
        );
        const updatedMovie = _.merge(MOVIES[args.id], updatedParams);
        MOVIES[args.id] = updatedMovie;
        return updatedMovie;
      } else return null;
    },
    delete: (parent, args) => {
      if (MOVIES[args.id]) {
        const deletedMovie = MOVIES[args.id];
        MOVIES.splice(args.id, 1);
        return deletedMovie;
      } else return null;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/server/schema.graphql',
  resolvers,
});

server.start(() => console.log("Server is running at http://localhost:4000"));