import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { Construct } from "constructs"

export interface SecurityGroups {
  app: ec2.ISecurityGroup
  db: ec2.ISecurityGroup
  vpcEndpoint: ec2.ISecurityGroup
}

export interface CreateSecurityGroupProps {
  resources: {
    vpc: ec2.IVpc
  }
}

export class CreateSecurityGroup extends Construct {
  readonly securityGroups: SecurityGroups

  constructor(scope: Construct, id: string, props: CreateSecurityGroupProps) {
    super(scope, id)

    const dbSg = new ec2.SecurityGroup(this, "DatabaseSecurityGroup", {
      vpc: props.resources.vpc,
      description: "Security group for Aurora PostgresSQL",
      allowAllOutbound: true,
    })

    const appSg = new ec2.SecurityGroup(this, "AppSecurityGroup", {
      vpc: props.resources.vpc,
      description: "Security group for Applications",
      allowAllOutbound: true,
    })

    const vpcEndpointSg = new ec2.SecurityGroup(this, "VPCEndpointSecurityGroup", {
      vpc: props.resources.vpc,
      allowAllOutbound: true,
    })

    dbSg.addIngressRule(appSg, ec2.Port.tcp(5432), "Allow Applications to access Aurora")

    this.securityGroups = {
      app: appSg,
      db: dbSg,
      vpcEndpoint: vpcEndpointSg,
    }
  }
}
