import React, { useState, createContext, useContext } from "react";

const INITIAL_STATE = {
  token: process.env.REACT_APP_USER_TOKEN,
  setToken: null,
};

const CurrentUserContext = createContext(INITIAL_STATE);

export const CurrentUserProvider = ({ children }) => {
  const [token, setToken] = useState(process.env.REACT_APP_USER_TOKEN);

  return (
    <CurrentUserContext.Provider
      value={{
        token: token,
        setToken: setToken,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
