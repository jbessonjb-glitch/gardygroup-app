export interface TeamMember {
  id: string
  email: string
  name: string | null
  role: "admin" | "editor" | "viewer"
  status: "pending" | "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export type SortField = "name" | "email" | "role" | "status" | "createdAt"
export type SortOrder = "asc" | "desc"
