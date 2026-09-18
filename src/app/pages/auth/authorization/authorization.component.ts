import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../../services/user.service';
import { UserApiService } from '../../../services/api/user-api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-authorization',
  imports: [NgClass, FormsModule, MatButtonModule, MatCheckboxModule, MatSnackBarModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})

export class AuthorizationComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private router = inject(Router);
  login = '';
  password = '';
  saveInStore = false;
  userApiService = inject(UserApiService);

  private _snackBar = inject(MatSnackBar);

  constructor(private userService2: UserService) {
    console.log('constr init');
  }

  ngOnInit(): void {
    console.log('auth init');
  }

  ngOnDestroy(): void {
    console.log('auth destroy');
  }

  onAuth(ev: Event): void {
    this.userApiService.auth({login: this.login, password: this.password}).subscribe (() => {
      if (this.saveInStore) {
        this.userService.saveUserInStore({login: this.login});
      } else {
        this.userService.setUser({login: this.login});
      }
      this.router.navigate(["/"]);
    },
    (err) => {
      this._snackBar.open('Ошибка авторизации. Проверьте логин и пароль.', 'Закрыть', {
        duration: null, // Не закрываем автоматически — пусть пользователь сам закроет
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });

  }

}