import { DocumentType } from './documentType'

export interface CreateUser {
  firstname: string
  lastname: string
  username: string
  password: string
  email: string
  documentType: DocumentType
  documentNumber: string
}



