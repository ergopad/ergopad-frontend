import { FC, ReactNode, createContext, useContext, useState } from 'react';

interface AddWalletContextType {
  addWalletOpen: boolean;
  setAddWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddWalletContext = createContext<AddWalletContextType | undefined>(undefined);

const AddWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [addWalletOpen, setAddWalletOpen] = useState<boolean>(false);

  // Context values passed to consumer
  const value = {
    addWalletOpen,
    setAddWalletOpen,
  };

  return (
    <AddWalletContext.Provider value={value}>
      {children}
    </AddWalletContext.Provider>
  );
};

interface AddWalletConsumerProps {
  children: (context: AddWalletContextType) => ReactNode;
}

const AddWalletConsumer: FC<AddWalletConsumerProps> = ({ children }) => {
  return (
    <AddWalletContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error(
            'AddWalletConsumer must be used within AddWalletProvider'
          );
        }
        return children(context);
      }}
    </AddWalletContext.Consumer>
  );
};

const useAddWallet = (): AddWalletContextType => {
  const context = useContext(AddWalletContext);
  if (context === undefined) {
    throw new Error('useAddWallet must be used within AddWalletProvider');
  }
  return context;
};

export { AddWalletProvider, AddWalletConsumer, useAddWallet };
