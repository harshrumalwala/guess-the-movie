import React from "react";
import gql from "graphql-tag";
import { Table } from "reactstrap";
import _ from "lodash";
import { useQuery } from "@apollo/react-hooks";

const GET_MOVIES = gql`
  {
    movies {
      id
      name
      cast {
        name
      }
      director {
        name
      }
      genre {
        name
      }
      releaseDate
    }
  }
`;

const MovieViewer = () => {
  const { loading, error, data } = useQuery(GET_MOVIES);

  if (error) return <h1>Something went wrong!</h1>;
  if (loading) return <h1>Loading...</h1>;

  return (
    <Table>
      <thead>
        <tr>
          <th>Movie</th>
          <th>Cast</th>
          <th>Director</th>
          <th>Genre</th>
          <th>Release Date</th>
        </tr>
      </thead>
      <tbody>
        {data.movies.map((movie) => (
          <tr key={movie.id}>
            <td>{movie.name}</td>
            <td>{_.map(movie.cast, "name").toString()}</td>
            <td>{movie.director.name}</td>
            <td>{movie.genre.name}</td>
            <td>{new Date(movie.releaseDate).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MovieViewer;
