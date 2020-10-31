import { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/react-hooks';

const CHECK_DIRECTOR = gql`
  query CheckDirector($id: Int!, $person: String!) {
    isDirectedBy(id: $id, person: $person)
  }
`;

const CHECK_CAST = gql`
  query CheckCast($id: Int!, $person: String!) {
    isPersonInCast(id: $id, person: $person)
  }
`;

const CHECK_GENRE = gql`
  query CheckGenre($id: Int!, $genre: String!) {
    isGenre(id: $id, genre: $genre)
  }
`;

const CHECK_PRIMARY_LANGUAGE = gql`
  query CheckPrimaryLanguage($id: Int!, $language: String!) {
    isPrimaryLanguage(id: $id, language: $language)
  }
`;

const CHECK_RELEASED_DATE = gql`
  query CheckReleaseDate($id: Int!, $releaseDate: Date!) {
    isReleasedAfter(id: $id, releaseDate: $releaseDate)
  }
`;

const CHECK_BOX_OFFICE_COLLECTION = gql`
  query CheckBoxOfficeCollection($id: Int!, $boxOffice: Float!) {
    isBoxOfficeCollectionGreaterThan(id: $id, boxOffice: $boxOffice)
  }
`;

const useVerifyGuess = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [
    checkDirector,
    { loading: loadingDirector, data: dataDirector }
  ] = useLazyQuery(CHECK_DIRECTOR);
  const [checkCast, { loading: loadingCast, data: dataCast }] = useLazyQuery(
    CHECK_CAST
  );
  const [checkGenre, { loading: loadingGenre, data: dataGenre }] = useLazyQuery(
    CHECK_GENRE
  );
  const [
    checkLanguage,
    { loading: loadingLanguage, data: dataLanguage }
  ] = useLazyQuery(CHECK_PRIMARY_LANGUAGE);
  const [
    checkReleaseDate,
    { loading: loadingReleaseDate, data: dataReleaseDate }
  ] = useLazyQuery(CHECK_RELEASED_DATE);
  const [
    checkBoxOfficeCollection,
    { loading: loadingCollection, data: dataCollection }
  ] = useLazyQuery(CHECK_BOX_OFFICE_COLLECTION);

  useEffect(() => {
    loadingDirector ||
    loadingCast ||
    loadingCollection ||
    loadingGenre ||
    loadingLanguage ||
    loadingReleaseDate
      ? setLoading(true)
      : setLoading(false);
  }, [
    loadingDirector,
    loadingCast,
    loadingCollection,
    loadingGenre,
    loadingLanguage,
    loadingReleaseDate
  ]);

  useEffect(() => {
    dataDirector && setData(dataDirector.isDirectedBy);
  }, [dataDirector]);

  useEffect(() => {
    dataCast && setData(dataCast.isPersonInCast);
  }, [dataCast]);

  useEffect(() => {
    dataLanguage && setData(dataLanguage.isPrimaryLanguage);
  }, [dataLanguage]);

  useEffect(() => {
    dataGenre && setData(dataGenre.isGenre);
  }, [dataGenre]);

  useEffect(() => {
    dataReleaseDate && setData(dataReleaseDate.isReleasedAfter);
  }, [dataReleaseDate]);

  useEffect(() => {
    dataCollection && setData(dataCollection.isBoxOfficeCollectionGreaterThan);
  }, [dataCollection]);

  const verifyGuess = (question, parameter, guess, id) => {
    switch (question) {
      case 0:
        checkLanguage({
          variables: { id, language: guess }
        });
        break;
      case 1:
        checkDirector({
          variables: { id, person: guess }
        });
        break;
      case 2:
        checkCast({
          variables: { id, person: guess }
        });
        break;
      case 3:
        checkGenre({
          variables: { id, genre: guess }
        });
        break;
      case 4:
        checkReleaseDate({
          variables: { id, releaseDate: guess }
        });
        break;
      case 5:
        checkBoxOfficeCollection({
          variables: { id, boxOffice: parseFloat(guess) }
        });
        break;
      default:
        break;
    }
  };

  return { verifyGuess, loading, data, setData };
};

export default useVerifyGuess;
