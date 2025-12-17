import { type Account, AccountName } from "../context/account"
import type { Region } from "../context/region"
import type { BaseNetworkProperties } from "./base-network"
import { DevProperties } from "./dev"
import { LocalProperties } from "./local"
import { ProdProperties } from "./prod"
import type { RdsProperties } from "./rds"
import type { S3Properties } from "./s3"
import { StgProperties } from "./stg"

export interface EnvProperties {
  context: ContextProperties
  baseNetwork: BaseNetworkProperties
  rds: RdsProperties
  s3Properties: S3Properties
}

export interface ContextProperties {
  account: Account
  region: Region
}

const Properties: { [key: string]: EnvProperties } = {
  [AccountName.local]: LocalProperties,
  [AccountName.dev]: DevProperties,
  [AccountName.staging]: StgProperties,
  [AccountName.production]: ProdProperties,
}

export const GetProperties = (accountName: AccountName) => Properties[accountName]
