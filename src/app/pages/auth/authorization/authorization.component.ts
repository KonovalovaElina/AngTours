import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-authorization',
  imports: [NgClass, FormsModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})

export class AuthorizationComponent {
  private userService = inject(UserService);
  login = '';
  password = '';
  saveInStore = false;

//   onAuth(ev: Event): void {
//     const savedUser = localStorage.getItem('user');

//     if (savedUser) {
//       if (this.login === savedUser) {
//         console.log('Логин совпадает, авторизация успешна');
//       } else {
//         alert('Неверный логин');
//       }
//     } else {
//       localStorage.setItem('user', this.login);
//       alert('Логин сохранён как основной');
//     }
//   }
// }

  onAuth(ev: Event): void {
    if (this.saveInStore) {
      this.userService.saveUserInStore({login: this.login});
    } else {
      this.userService.setUser({login: this.login});
    }
  }

}