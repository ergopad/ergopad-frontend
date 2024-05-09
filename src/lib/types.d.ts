interface Signature {
  signedMessage: string
  proof: string
}

type NonceResponse = {
  nonce: string
  userId: string
}

type Anchor = 'bottom' | 'left' | 'right' | 'top' | undefined

type TWalletListItem = {
  name: string
  connectName: string
  icon: string
  iconDark: string
  mobile: boolean
  url: string
}

type TProRataFormProps = {
  id: number
  startDate: Date
  endDate: Date
  tokenTarget: number
  tokenTicker: string
  price: number
  currency: string
  deposited: number
  name: string
  projectName: string
  projectIcon: string
  projectSlug: string
  whitelistSlug: string | null
  recipientAddress: string | null
  restrictedCountries: string[]
}
