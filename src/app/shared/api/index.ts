import { environment } from "../../../environments/environment"

export const API = {
  auth: `${environment.server}/auth`,
  register: `${environment.server}/register`
} as const;