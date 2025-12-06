import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { Construct } from "constructs"
import type { BaseNetworkProperties } from "./properties/base-network"

export interface BaseNetworks {
  vpc: ec2.IVpc
  subnets: {
    gateways: ec2.ISubnet[]
    app: ec2.ISubnet[]
    database: ec2.ISubnet[]
  }
}

export interface CreateBaseNetworkProps {
  properties: BaseNetworkProperties
}

export class CreateBaseNetwork extends Construct {
  readonly baseNetworks: BaseNetworks

  constructor(scope: Construct, id: string, props: CreateBaseNetworkProps) {
    super(scope, id)

    const vpc = new ec2.Vpc(this, "BusinessCalendarVpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: props.properties.vpc.maxAzs,
      natGateways: props.properties.vpc.natGateways,
      subnetConfiguration: [
        {
          name: "Gateway",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
          mapPublicIpOnLaunch: false,
        },
        {
          name: "App",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "Database",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    })

    const gatewaySubnets = vpc.selectSubnets({ subnetGroupName: "Gateway" })
    const appSubnets = vpc.selectSubnets({ subnetGroupName: "App" })
    const databaseSubnets = vpc.selectSubnets({ subnetGroupName: "Database" })

    this.baseNetworks = {
      vpc: vpc,
      subnets: {
        gateways: gatewaySubnets.subnets,
        app: appSubnets.subnets,
        database: databaseSubnets.subnets,
      },
    }
  }
}
