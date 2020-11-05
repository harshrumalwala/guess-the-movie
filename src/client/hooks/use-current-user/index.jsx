import React, { useState, createContext, useContext } from 'react';

const INITIAL_STATE = {
  token: null,
  userId: null,
  setToken: null,
  setUserId: null
};

const CurrentUserContext = createContext(INITIAL_STATE);

export const CurrentUserProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

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
