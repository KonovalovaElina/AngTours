import { Injectable } from '@angular/core';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: IUser;

  constructor() {
    this.restoreUserFromStore();
  }

  private restoreUserFromStore(): void {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        this.user = JSON.parse(raw) as IUser;
      }
    } catch {
      // битые данные или недоступное хранилище — остаёмся без пользователя
      localStorage.removeItem('user');
    }
  }

  saveUserInStore(user: IUser): void {
    this.setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): IUser {
    return this.user;
  }

  setUser(user: IUser): void {
    this.user = user;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
}
