export interface Signature {
  signedMessage: string;
  proof: string;
}

export type Anchor = "bottom" | "left" | "right" | "top" | undefined