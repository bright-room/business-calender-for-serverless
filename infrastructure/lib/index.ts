import * as cdk from "aws-cdk-lib"
import type { Construct } from "constructs"
import { CreateBaseNetwork } from "./base-network"
import { CreateInterfaceEndpoint } from "./interface-endpoint"
import type { ContextProperties } from "./properties"
import type { BaseNetworkProperties } from "./properties/base-network"
import type { RdsProperties } from "./properties/rds"
import type { S3Properties } from "./properties/s3"
import { CreateRds } from "./rds"
import { CreateS3Bucket } from "./s3"
import { CreateSecurityGroup } from "./sg"
import { _suppressions } from "./utils/nag-suppressions"

export interface BusinessCalenderStackProps extends cdk.StackProps {
  contextProperties: ContextProperties
  baseNetworkProperties: BaseNetworkProperties
  rdsProperties: RdsProperties
  s3Properties: S3Properties
}

export class BusinessCalenderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BusinessCalenderStackProps) {
    super(scope, id, props)
    _suppressions(this)

    const { baseNetworks } = new CreateBaseNetwork(this, "BaseNetwork", {
      properties: props.baseNetworkProperties,
    })

    const { securityGroups } = new CreateSecurityGroup(this, "SecurityGroup", {
      resources: {
        vpc: baseNetworks.vpc,
      },
    })

    new CreateInterfaceEndpoint(this, "InterfaceEndpoint", {
      resources: {
        vpc: baseNetworks.vpc,
        subnets: {
          db: baseNetworks.subnets.database,
        },
        securityGroups: {
          vpcEndpoint: securityGroups.vpcEndpoint,
        },
      },
    })

    new CreateRds(this, "Rds", {
      context: props.contextProperties,
      properties: props.rdsProperties,
      resources: {
        vpc: baseNetworks.vpc,
        subnets: {
          db: baseNetworks.subnets.database,
        },
        securityGroups: {
          db: securityGroups.db,
        },
      },
    })

    new CreateS3Bucket(this, "S3Bucket", {
      properties: props.s3Properties,
    })
  }
}
