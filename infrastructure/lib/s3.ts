import * as cdk from "aws-cdk-lib"
import { aws_s3 as s3 } from "aws-cdk-lib"
import { Construct } from "constructs"
import type { S3Properties } from "./properties/s3"

export interface Buckets {
  businessCalendar: s3.IBucket
}

export interface CreateS3BucketProps {
  properties: S3Properties
}

export class CreateS3Bucket extends Construct {
  readonly buckets: Buckets

  constructor(scope: Construct, id: string, props: CreateS3BucketProps) {
    super(scope, id)

    const accessLogsBucket = new s3.Bucket(this, "S3AccessLogsBucket", {
      bucketName: "s3-access-logs",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [
        {
          enabled: true,
          expiration: cdk.Duration.days(365),
        },
      ],
    })

    const businessCalendar = new s3.Bucket(this, "BusinessCalendarBucket", {
      bucketName: "business-calendar",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      eventBridgeEnabled: true,
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "business-calendar/",
      lifecycleRules: [
        {
          enabled: props.properties.lifecycle.enabled,
          expiration: cdk.Duration.days(props.properties.lifecycle.expirationDays || 1),
        },
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
    })

    this.buckets = {
      businessCalendar: businessCalendar,
    }
  }
}
