export interface TeamsDataSchema {
    id: string
    name: string
    employees?: {
        id: string
        fullName: string
    }
}

export interface CreateTeamInput {
    teamName: string
}