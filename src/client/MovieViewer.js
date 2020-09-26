import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';
import _ from 'lodash';

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      name
      cast {
        name
      }
      director {
        name
      }
      genre
      releaseDate
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
            <th>Cast</th>
            <th>Director</th>
            <th>Genre</th>
            <th>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {data.movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{_.map(movie.cast, 'name').toString()}</td>
              <td>{movie.director.name}</td>
              <td>{movie.genre}</td>
              <td>{new Date(movie.releaseDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Query>
);