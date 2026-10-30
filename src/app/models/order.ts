export type UserFormValue = { firstname: string; lastname: string; birthDate: string; age: number; citizenship: string };

export interface IOrder {
  userLogin: string;
  tourId: string;
  personalDate: UserFormValue[];
}

export interface IOrderResp {
  status: string
}