export const AccountId = {
  local: "000000000000",
  dev: "000000000001",
  staging: "000000000002",
  production: "000000000003",
} as const
export type AccountId = (typeof AccountId)[keyof typeof AccountId]

export const AccountName = {
  local: "local",
  dev: "dev",
  staging: "stg",
  production: "prod",
} as const
export type AccountName = (typeof AccountName)[keyof typeof AccountName]

export interface Account {
  id: AccountId
  name: AccountName
}

export const LocalAccount: Account = {
  id: AccountId.local,
  name: AccountName.local,
}

export const DevAccount: Account = {
  id: AccountId.dev,
  name: AccountName.dev,
}

export const StagingAccount: Account = {
  id: AccountId.staging,
  name: AccountName.staging,
}

export const ProductionAccount: Account = {
  id: AccountId.production,
  name: AccountName.production,
}
