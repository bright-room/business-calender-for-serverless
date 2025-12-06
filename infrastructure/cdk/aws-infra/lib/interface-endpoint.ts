import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { Construct } from "constructs"

export interface CreateInterfaceEndpointProps {
  resources: {
    vpc: ec2.IVpc
    subnets: {
      db: ec2.ISubnet[]
    }
    securityGroups: {
      vpcEndpoint: ec2.ISecurityGroup
    }
  }
}

export class CreateInterfaceEndpoint extends Construct {
  constructor(scope: Construct, id: string, props: CreateInterfaceEndpointProps) {
    super(scope, id)

    new ec2.InterfaceVpcEndpoint(this, "SecretsManagerEndpoint", {
      vpc: props.resources.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: props.resources.subnets.db },
      securityGroups: [props.resources.securityGroups.vpcEndpoint],
    })
  }
}
