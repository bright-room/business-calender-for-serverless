export const Region = {
  AP_NORTHEAST_1: "ap-northeast-1",
} as const
export type Region = (typeof Region)[keyof typeof Region]
