import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      name
      actors
      actresses
      director
      genre
      releasedDate
    }
  }
`;

export default () => (
  <Query query={GET_MOVIES}>
    {({ loading, data }) => !loading && (
      <Table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Actors</th>
            <th>Actresses</th>
            <th>Director</th>
            <th>Genre</th>
            <th>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {data.movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.actors}</td>
              <td>{movie.actresses}</td>
              <td>{movie.director}</td>
              <td>{movie.genre}</td>
              <td>{movie.releasedDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Query>
);