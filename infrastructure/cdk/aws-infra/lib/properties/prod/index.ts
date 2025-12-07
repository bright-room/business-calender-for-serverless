import { ProductionAccount } from "../../context/account"
import { Region } from "../../context/region"
import type { EnvProperties } from "../index"

export const ProdProperties: EnvProperties = {
  context: {
    account: ProductionAccount,
    region: Region.AP_NORTHEAST_1,
  },
  baseNetwork: {
    vpc: {
      maxAzs: 2,
      natGateways: 1,
    },
  },
  rds: {
    cluster: {
      maxCapacity: 4,
      backup: {
        enabled: true,
        retentionDays: 1,
        preferredWindow: "16:00-16:30",
      },
    },
  },
  s3Properties: {
    lifecycle: {
      enabled: true,
      expirationDays: 90,
    },
  },
}
