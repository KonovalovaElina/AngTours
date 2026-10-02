import { environment } from "../../../environments/environment"

export const API = {
  auth: `${environment.server}/auth`,
  register: `${environment.server}/register`,
  tours: `${environment.server}/tours`,
  tourItemBase: `${environment.server}/tour`
} as const;