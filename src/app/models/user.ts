export interface IUser {
  login: string
}

export interface IAuthUser extends IUser {
  password: string,
  id?: string
}

export interface IRegisterUser extends IAuthUser {
  email?: string
}

export interface IRegUserRes {
  status: string
}

export interface IAuthUserRes {
  access_token: string;
  id: string;
  user: {
    login: string;
  };
}