import type * as cdk from "aws-cdk-lib"
import { NagSuppressions } from "cdk-nag"

export const _suppressions = (stack: cdk.Stack): void => {
  // Suppress CDK auto-generated Lambda IAM policy warnings
  NagSuppressions.addStackSuppressions(stack, [
    {
      id: "AwsSolutions-IAM4",
      reason:
        "AWS managed policies are used by CDK-generated Lambda functions (LogRetention, BucketNotifications) which are internal to CDK",
      appliesTo: ["Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"],
    },
    {
      id: "AwsSolutions-IAM5",
      reason:
        "Wildcard permissions are required by CDK-generated Lambda functions (LogRetention, BucketNotifications) for CloudWatch Logs and S3 operations",
      appliesTo: ["Resource::*"],
    },
  ])
}
