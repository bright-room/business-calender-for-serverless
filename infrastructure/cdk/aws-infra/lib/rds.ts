import * as cdk from "aws-cdk-lib"
import {
  type aws_ec2 as ec2,
  aws_logs as logs,
  aws_rds as rds,
  aws_secretsmanager as secretsmanager,
} from "aws-cdk-lib"
import { Construct } from "constructs"
import { AccountName } from "./context/account"
import type { ContextProperties } from "./properties"
import type { RdsProperties } from "./properties/rds"

export interface Rds {
  cluster: rds.IDatabaseCluster
  proxy: rds.IDatabaseProxy
  secret: secretsmanager.ISecret
}

export interface CreateRdsProps {
  context: ContextProperties
  properties: RdsProperties
  resources: {
    vpc: ec2.IVpc
    subnets: {
      db: ec2.ISubnet[]
    }
    securityGroups: {
      db: ec2.ISecurityGroup
    }
  }
}

export class CreateRds extends Construct {
  readonly rds: Rds

  constructor(scope: Construct, id: string, props: CreateRdsProps) {
    super(scope, id)

    const EXCLUDE_CHARACTERS = ":@/\" '"
    const rdsCredentials = new secretsmanager.Secret(this, "AuroraPostgresClusterRdsCredentials", {
      secretName: "business-calender-rds-credentials",
      generateSecretString: {
        excludeCharacters: EXCLUDE_CHARACTERS,
        generateStringKey: "password",
        passwordLength: 32,
        requireEachIncludedType: true,
        secretStringTemplate: '{"username": "bradmin"}',
      },
    })

    let clusterBackups: rds.BackupProps | undefined
    if (props.properties.cluster.backup.enabled) {
      if (props.properties.cluster.backup.retentionDays === undefined) {
        throw new Error("retentionDays is required when backup is enabled")
      }

      if (props.properties.cluster.backup.preferredWindow === undefined) {
        throw new Error("preferredWindow is required when backup is enabled")
      }

      clusterBackups = {
        retention: cdk.Duration.days(props.properties.cluster.backup.retentionDays),
        preferredWindow: props.properties.cluster.backup.preferredWindow,
      }
    }

    const cluster = new rds.DatabaseCluster(this, "AuroraPostgresCluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_17_6,
      }),
      writer: rds.ClusterInstance.serverlessV2("Writer", {
        enablePerformanceInsights: true,
        publiclyAccessible: false,
      }),
      readers: [
        rds.ClusterInstance.serverlessV2("Reader", {
          enablePerformanceInsights: true,
          publiclyAccessible: false,
          scaleWithWriter: true,
        }),
      ],
      port: 5432,
      credentials: rds.Credentials.fromSecret(rdsCredentials),
      storageEncrypted: true,
      iamAuthentication: true,
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: props.properties.cluster.maxCapacity,
      defaultDatabaseName: "business-calender",
      vpc: props.resources.vpc,
      vpcSubnets: {
        subnets: props.resources.subnets.db,
      },
      securityGroups: [props.resources.securityGroups.db],
      backup: clusterBackups,
      cloudwatchLogsExports: ["postgresql"],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_YEAR,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // あまり環境差異的なものを作りたくないが、localstack上だと構築できなかったため、localの時だけ除外
    if (props.context.account.name !== AccountName.local) {
      cluster.addRotationSingleUser({
        excludeCharacters: EXCLUDE_CHARACTERS,
        automaticallyAfter: cdk.Duration.days(90),
      })
    }

    const rdsProxy = new rds.DatabaseProxy(this, "AuroraPostgresClusterRdsProxy", {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [rdsCredentials],
      vpc: props.resources.vpc,
      dbProxyName: "business-calender-rds-proxy",
      debugLogging: true,
      requireTLS: true,
      securityGroups: [props.resources.securityGroups.db],
      vpcSubnets: {
        subnets: props.resources.subnets.db,
      },
    })

    this.rds = {
      cluster: cluster,
      proxy: rdsProxy,
      secret: rdsCredentials,
    }
  }
}
