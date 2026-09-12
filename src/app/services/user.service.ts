import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;

  constructor() { }

  saveUserInStore(user: any): void {
    this.setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return this.user;
  }

  setUser(user: any): void {
    this.user = user;
  }
}
