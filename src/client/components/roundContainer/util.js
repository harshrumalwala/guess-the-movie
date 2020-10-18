import { gql } from '@apollo/react-hooks';

export const questionValues = [
  {
    value: 0,
    displayValue: `Is movie's primary language`
  },
  {
    value: 1,
    displayValue: `Is movie directed by`
  },
  {
    value: 2,
    displayValue: `Does movie cast include`
  },
  {
    value: 3,
    displayValue: `Is movie genre in`
  },
  {
    value: 4,
    displayValue: `Is movie released`
  },
  {
    value: 5,
    displayValue: `Is movie's box office collection`
  }
];

export const parameterValues = [
  {
    value: 0,
    displayValue: `before`
  },
  {
    value: 1,
    displayValue: `after`
  },
  {
    value: 2,
    displayValue: `less than`
  },
  {
    value: 3,
    displayValue: `more than`
  }
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
  query GetMovies {
    genres {
      name
    }
  }
`;
