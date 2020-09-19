const express = require('express');
const cors = require('cors');
const {
  graphqlHTTP
} = require('express-graphql');
const gql = require('graphql-tag');
const {
  buildASTSchema
} = require('graphql');

const MOVIES = [{
    name: "The Avengers",
    director: "Joss Whedon",
    genre: "Action",
    releaseDate: 1335484800,
    actors: "Robert Downey Jr, Chris Evans, Mark Ruffalo, Chris Hemsworth",
    actresses: "Scarlett Johansson"
  },
  {
    name: "Creed",
    director: "Ryan Coogler",
    genre: "Action",
    releaseDate: 1448582400,
    actors: "Michael B. Jordan, Sylvester Stallone",
    actresses: "Tessa Thompson"
  },
];

const schema = buildASTSchema(gql `
  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
  }

  type Movie {
    id: ID
    name: String
    director: String
    genre: String
    actors: String
    actresses: String
    releaseDate: Int
  }
`);

const mapMovie = (movie, id) => movie && ({
  id,
  ...movie
});

const root = {
  movies: () => MOVIES.map(mapMovie),
  movie: ({
    id
  }) => mapMovie(MOVIES[id], id),
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);