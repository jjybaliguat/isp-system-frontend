interface LogsProps {
    id: string
    action: string
    entity: string
    createdAt: string
    message: string
    user: {
        id: string
        fullName?: string
        employee?: {
          fullName: string
        }
    }
}

interface LogsTableProps {
  data: LogsProps[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  currentPage: number
  onPageChange: (page: number) => void
  rowsPerPage: number
  onRowsPerPageChange: (limit: number) => void
}