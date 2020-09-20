const { GraphQLServer } = require("graphql-yoga");
const _ = require("lodash");

const MOVIES = [
  {
    name: "The Avengers",
    director: "Joss Whedon",
    genre: "Action",
    releaseDate: 1335484800,
    actors: "Robert Downey Jr, Chris Evans, Mark Ruffalo, Chris Hemsworth",
    actresses: "Scarlett Johansson",
  },
  {
    name: "Creed",
    director: "Ryan Coogler",
    genre: "Action",
    releaseDate: 1448582400,
    actors: "Michael B. Jordan, Sylvester Stallone",
    actresses: "Tessa Thompson",
  },
];

const typeDefs = `
  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie!
  }

  type Movie {
    id: ID!
    name: String!
    director: String!
    genre: String!
    actors: String!
    actresses: String!
    releaseDate: Int!
  }
`;

const mapMovie = (movie, id) =>
  movie && {
    id,
    ...movie,
  };

const resolvers = {
  Query: {
    movies: () => _.map(MOVIES, mapMovie),
    movie: ({ id }) => mapMovie(MOVIES[id], id),
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log("Server is running at http://localhost:4000"));
