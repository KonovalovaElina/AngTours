import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../../services/user.service';
import { UserApiService } from '../../../services/api/user-api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../../../services/loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuthUserRes } from '../../../models/user';
@Component({
  selector: 'app-authorization',
  imports: [NgClass, FormsModule, MatButtonModule, MatCheckboxModule, MatSnackBarModule, LoaderComponent, AsyncPipe],
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
  
  private loaderService = inject(LoaderService);
  loaderStatus$ = this.loaderService.loader$;

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
    this.userApiService.auth({login: this.login, password: this.password}).subscribe ((res: IAuthUserRes) => {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('id', res.id);
      this.userService.saveUserInStore({login: this.login});
      this.router.navigate(["/"]);
    },
    (err: HttpErrorResponse) => {
      const errorBody = err.error;
      let message: string | null = null;

      if (
        typeof errorBody === 'object' &&
        errorBody !== null &&
        typeof errorBody.errorText === 'string'
      ) {
        message = errorBody.errorText;
      }

      // Если сервер ничего не прислал — подставляем понятный текст по статусу
      if (!message) {
        if (err.status === 409) {
          message = 'Ошибка авторизации. Проверьте логин и пароль.';
        } else {
          message = 'Произошла ошибка авторизации. Попробуйте позже.';
        }
      }

      this._snackBar.open(message, 'Закрыть', {
        duration: null, // Не закрываем автоматически — пусть пользователь сам закроет
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });

  }

}