import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserApiService } from '../../../services/api/user-api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  imports: [NgClass, FormsModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  login = '';
  password = '';
  passwordRepeat = '';
  email = '';
  userApiService = inject(UserApiService);

  private _snackBar = inject(MatSnackBar);

  onReg(ev: Event): void {
    this.userApiService.register({login: this.login, password: this.password, email:this.email}).subscribe (() => {
      this._snackBar.open('Вы успешно зарегистрированы!', 'Закрыть', {
        duration: 3000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    },
    (err) => {
      let message = 'Произошла ошибка регистрации. Попробуйте позже.';

      if (err instanceof HttpErrorResponse) {
        const errorText = err.error?.message || String(err.error) || '';

        if (
          errorText.includes('Пользователь уже зарегестрирован')
        ) {
          message = 'Пользователь с таким логином уже зарегистрирован.';
        }
      }

      this._snackBar.open(message, 'Закрыть', {
        duration: null,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }
}
