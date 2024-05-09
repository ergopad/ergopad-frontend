import { FC, ReactNode, createContext, useContext, useState } from 'react'

interface SearchContextType {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

interface SearchConsumerProps {
  children: (context: SearchContextType) => ReactNode
}

interface SearchProviderProps {
  children: ReactNode
}

const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [search, setSearch] = useState<string>('')

  const value = {
    search,
    setSearch,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

interface SearchConsumerProps {
  children: (context: SearchContextType) => ReactNode
}

const SearchConsumer: FC<SearchConsumerProps> = ({ children }) => {
  return (
    <SearchContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('SearchConsumer must be used within SearchProvider')
        }
        return children(context)
      }}
    </SearchContext.Consumer>
  )
}

const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

export { SearchProvider, SearchConsumer, useSearch }
