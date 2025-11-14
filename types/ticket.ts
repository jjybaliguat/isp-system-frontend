export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TicketStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  OVERDUE = "OVERDUE",
}

export enum TicketCategory {
  BILLING = "BILLING",
  TECHNICAL = "TECHNICAL",
  INSTALLATION = "INSTALLATION",
  SERVICE = "SERVICE",
  REPAIR = "REPAIR",
  GENERAL = "GENERAL",
}

export interface TicketDataSchema {
  id: string
  subject: string
  description?: string
  priority: TicketPriority
  status: TicketStatus
  ticketNumber: string
  category: TicketCategory
  attachments: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  client: {
    id: string
    fullName: string
  }
  assignedToTeam?: {
    id: string
    name?: string
  }
  assignedToEmployee?: {
    id: string
    fullName?: string
  }
  createdBy?: {
    id: string,
    fullName: string
  }
  providerId: string
}

export interface TicketCommentDataSchema {
  id: string
  message: string
  createdAt: string
  userId?: string
  user?: {
    id: string,
    fullName?: string
    employee?: {
      fullName: string
    }
  }
  ticketId: string
}
export interface TicketLogsDataSchema {
  id: string
  action: string
  createdAt: string
  user?: {
    id: string,
    fullName?: string
    employee?: {
      fullName: string
    }
  }
  ticketId: string
}

export interface TicketLogDataSchema {
  id: string
  action: string
  createdAt: string
  userId?: string
  userName?: string
  ticketId: string
}

export interface CreateTicketInput {
  subject: string
  description?: string
  category: TicketCategory
  priority: TicketPriority
  attachments?: string[]
  dueDate?: string
  assignedToTeamId?: string
  ticketNumber: string
  clientId?: string
}

export interface UpdateTicketInput {
  status?: TicketStatus
  priority?: TicketPriority
  assignedToTeamId?: string
  assignedToEmployeeId?: string
}

export interface CreateTicketCommentInput {
  message: string
  ticketId: string
}
