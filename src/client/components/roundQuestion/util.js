import { gql } from '@apollo/react-hooks';
import _ from 'lodash';

export const questionValues = [
  `Is movie's primary language`,
  `Is movie directed by`,
  `Does movie cast include`,
  `Is movie's genre`,
  `Is movie released`,
  `Is movie's box office collection`
];

export const parameterValues = [
  { key: 0, displayValue: `before` },
  { key: 1, displayValue: `after` },
  { key: 2, displayValue: `less than` },
  { key: 3, displayValue: `more than` }
];

export const questionParameterMap = {
  4: [0, 1],
  5: [2, 3]
};

export const GET_DIRECTORS = gql`
  query GetDirectors {
    directors {
      name
    }
  }
`;

export const GET_CAST = gql`
  query GetCast {
    cast {
      name
    }
  }
`;

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      name
    }
  }
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres {
      name
    }
  }
`;

export const populateReleasedDate = (currentDetails, guess, data) =>
  _.assign(
    {},
    currentDetails,
    data
      ? !currentDetails?.releasedAfter || guess > currentDetails.releasedAfter
        ? { releasedAfter: guess }
        : {}
      : !currentDetails?.releasedBefore || guess < currentDetails.releasedBefore
      ? { releasedBefore: guess }
      : {}
  );

export const populateCollection = (currentDetails, guess, data) =>
  _.assign(
    {},
    currentDetails,
    data
      ? !currentDetails?.collectionGt || guess > currentDetails.collectionGt
        ? { collectionGt: guess }
        : {}
      : !currentDetails?.collectionLt || guess < currentDetails.collectionLt
      ? { collectionLt: guess }
      : {}
  );

export const populateCast = (currentDetails, guess, data) => ({
  ...currentDetails,
  cast: currentDetails?.cast ? _.uniq([...currentDetails.cast, guess]) : [guess]
});

export const populateGenre = (currentDetails, guess, data) => ({
  ...currentDetails,
  genre: currentDetails?.genre
    ? _.uniq([...currentDetails.genre, guess])
    : [guess]
});

export const isNumber = (guess) => guess !== '' && !isNaN(guess);
