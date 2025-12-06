import { StagingAccount } from "../../context/account"
import { Region } from "../../context/region"
import type { EnvProperties } from "../index"

export const StgProperties: EnvProperties = {
  context: {
    account: StagingAccount,
    region: Region.AP_NORTHEAST_1,
  },
  baseNetwork: {
    vpc: {
      maxAzs: 1,
      natGateways: 1,
    },
  },
  rds: {
    cluster: {
      maxCapacity: 1,
      backup: {
        enabled: false,
      },
    },
  },
  s3Properties: {
    lifecycle: {
      enabled: false,
    },
  },
}
