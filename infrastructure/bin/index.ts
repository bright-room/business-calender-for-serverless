#!/usr/bin/env node

import "source-map-support/register"
import { BusinessCalenderStack } from "../lib"
import type { AccountName } from "../lib/context/account"
import { GetProperties } from "../lib/properties"
import { GraphGenerateSupport } from "../lib/utils/graph"

GraphGenerateSupport("BusinessCalenderForServerless", (scope) => {
  const env = scope.node.tryGetContext("env") || "local"
  const envProperties = GetProperties(env as AccountName)

  const baseProps = {
    env: {
      account: envProperties.context.account.id,
      region: envProperties.context.region,
    },
  }

  new BusinessCalenderStack(scope, "BusinessCalenderStack", {
    ...baseProps,
    contextProperties: envProperties.context,
    baseNetworkProperties: envProperties.baseNetwork,
    rdsProperties: envProperties.rds,
    s3Properties: envProperties.s3Properties,
  })
}).then()
