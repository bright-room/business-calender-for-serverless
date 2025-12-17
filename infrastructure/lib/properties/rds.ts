export interface RdsProperties {
  cluster: {
    maxCapacity: number
    backup: {
      enabled: boolean
      retentionDays?: number
      preferredWindow?: string
    }
  }
}
