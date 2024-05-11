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
  id: string
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

interface Country {
  label: string;
  code: string;
}

interface ProjectSocials {
  telegram: string;
  twitter: string;
  discord: string;
  github: string;
  website: string;
  linkedin: string;
}

interface ProjectRoadmapEvent {
  name: string;
  description: string;
  date: string;
}

interface ProjectRoadmap {
  roadmap: ProjectRoadmapEvent[];
}

interface ProjectTeamMember {
  name: string;
  description: string;
  profileImgUrl: string;
  socials: Socials;
}

interface ProjectTeam {
  team: ProjectTeamMember[];
}

interface ProjectTokenomicsDetail {
  name: string;
  amount: number;
  value: string;
  tge: string;
  freq: string;
  length: string;
  lockup: string;
}

interface ProjectTokenomics {
  tokenName: string;
  totalTokens: number;
  tokenTicker: string;
  tokenomics: ProjectTokenomicsDetail[];
}

interface ProjectDetails {
  name: string;
  shortDescription: string;
  description: string;
  fundsRaised: number;
  bannerImgUrl: string;
  isLaunched: boolean;
  socials: ProjectSocials;
  roadmap: ProjectRoadmap;
  team: ProjectTeam;
  tokenomics: ProjectTokenomics;
  isDraft: boolean;
  id: number;
}

type WalletButtonProps = {
  name: string;
  walletType: string;
  icon: string;
  iconDark: string;
  messageSigning: boolean;
}

interface WalletListItem {
  addresses: string[];
  name: string;
}

interface TransferAmount {
  tokenId: string;
  amount: number;
}

interface AllowedToken {
  id: string;
  name: string;
  icon: string | null;
  decimals: number;
}

type TokenInfoApi = {
  token_id: string;
  token_name: string;
  token_description: string;
  decimals: number;
  minted: number;
  value_in_erg: number;
  locked_supply: number;
  liquid_supply: number;
  burned_supply: number;
};