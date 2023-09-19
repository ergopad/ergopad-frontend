import React, { ReactNode, createContext, useContext, useState, FunctionComponent } from 'react';
import { Session } from 'next-auth';

interface WalletState {
  wallet: string | undefined;
  dAppWallet: {
    connected: boolean;
    name: string;
    addresses: string[];
  };
  sessionData: Session | null;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}

interface WalletContextType extends WalletState {
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  setDAppWallet: React.Dispatch<React.SetStateAction<WalletState['dAppWallet']>>;
  setSessionData: React.Dispatch<React.SetStateAction<WalletState['sessionData']>>;
  setSessionStatus: React.Dispatch<React.SetStateAction<WalletState['sessionStatus']>>;
}

interface WalletConsumerProps {
  children: (context: WalletContextType) => ReactNode;
}

// The Context with a default value (can be undefined if preferred)
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Template Provider
const WalletProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<string>('');
  const [dAppWallet, setDAppWallet] = useState<WalletState['dAppWallet']>({
    connected: false,
    name: '',
    addresses: [],
  });
  const [sessionData, setSessionData] = useState<WalletState['sessionData']>(null)
  const [sessionStatus, setSessionStatus] = useState<WalletState['sessionStatus']>('unauthenticated')

  // Context values passed to consumer
  const value = {
    wallet,
    dAppWallet,
    setWallet,
    setDAppWallet,
    sessionData,
    setSessionData,
    sessionStatus,
    setSessionStatus
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// template consumer
const WalletConsumer: FunctionComponent<WalletConsumerProps> = ({ children }) => {
  return (
    <WalletContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('WalletConsumer must be used within WalletProvider');
        }
        return children(context);
      }}
    </WalletContext.Consumer>
  );
};

// useTemplate Hook
const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export { WalletProvider, WalletConsumer, useWallet };