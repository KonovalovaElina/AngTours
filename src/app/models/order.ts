export type UserFormValue = { firstname: string; lastname: string; birthDate: string; age: number; citizenship: string };

export interface IOrder {
  firstname: string;
  lastname: string;
  birthDate: string;
  age: number;
  citizenship: string
  tourId: string;
  userId: string;
}

export interface IOrderResp {
  status: string
}