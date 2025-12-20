export interface S3Properties {
  lifecycle: {
    enabled: boolean
    expirationDays?: number
  }
}
