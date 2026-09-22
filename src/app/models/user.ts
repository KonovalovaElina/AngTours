export interface IUser {
  login: string
}

export interface IAuthUser extends IUser {
  password: string
}

export interface IRegisterUser extends IAuthUser {
  email?: string
}

export interface IRegUserRes {
  status: string
}

export interface IAuthUserRes extends IRegisterUser {
  
}