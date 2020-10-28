import React, { useState, createContext, useContext } from 'react';

const INITIAL_STATE = {
  token: process.env.REACT_APP_USER_TOKEN,
  userId: process.env.REACT_APP_USER_ID,
  setToken: null,
  setUserId: null
};

const CurrentUserContext = createContext(INITIAL_STATE);

export const CurrentUserProvider = ({ children }) => {
  const [token, setToken] = useState(process.env.REACT_APP_USER_TOKEN);
  const [userId, setUserId] = useState(process.env.REACT_APP_USER_ID);

  return (
    <CurrentUserContext.Provider
      value={{
        token: token,
        userId: userId,
        setToken: setToken,
        setUserId: setUserId
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
