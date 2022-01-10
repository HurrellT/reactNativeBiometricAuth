import React, { createContext, useContext, useState } from 'react';

type UnlockContextType = [string | undefined, (k: string) => void] | undefined;

const UnlockContext = createContext<UnlockContextType>(undefined);

const UnlockProvider: React.FC = ({ children }) => {
  const [tokenKey, setTokenKey] = useState<string | undefined>();
  const handleTokenKey = (k: string | undefined) => setTokenKey(k);

  return (
    <UnlockContext.Provider value={[tokenKey, handleTokenKey]}>
      {children}
    </UnlockContext.Provider>
  );
};

const useUnlock = () => {
  const tokenKey = useContext(UnlockContext);

  if (!tokenKey) {
    throw new Error('Initialize the context first!');
  } else {
    return tokenKey;
  }
};

export { useUnlock };

export default UnlockProvider;