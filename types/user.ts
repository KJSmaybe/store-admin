export type UserRole =
  | 'ADMIN'
  | 'MANAGER'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserInput {
  role?: UserRole
  isActive?: boolean
}