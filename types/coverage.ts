import { ClientDataSchema } from "./clients"

export interface CoverageDataSchema {
    id: string
    name: string
    latitude: number
    longitude: number
    radius: number
    clients?: ClientDataSchema[]
}

export interface CoverageInput {
    name: string
    latitude: number
    longitude: number
    radius: number
}