import React, { useState, createContext, useContext } from "react";

const INITIAL_STATE = {
  token: null,
  setToken: null,
};

const CurrentUserContext = createContext(INITIAL_STATE);

export const CurrentUserProvider = ({ children }) => {
  const [token, setToken] = useState(null);

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
