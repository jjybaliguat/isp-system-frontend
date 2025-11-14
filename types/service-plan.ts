export interface ServicePlanDataSchema {
    id: string
    name: string
    speedMbps: number
    monthlyFee: number
    descriptions: string[]
    clients?: {
        id: string
        fullName: string
    }
}

export interface ServicePlanInput {
    name: string
    speedMbps: number
    monthlyFee: number
    descriptions: string[]
}