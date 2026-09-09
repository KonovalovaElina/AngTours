import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-authorization',
  imports: [NgClass, FormsModule, MatButtonModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})

export class AuthorizationComponent {
  login = '';
  password = '';

  onAuth(ev: Event): void {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      if (this.login === savedUser) {
        console.log('Логин совпадает, авторизация успешна');
      } else {
        alert('Неверный логин');
      }
    } else {
      localStorage.setItem('user', this.login);
      alert('Логин сохранён как основной');
    }
  }
}
