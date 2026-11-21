import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TourItemService } from '../../services/tour-item.service';
import { UserService } from '../../services/user.service';
import { ITour } from '../../models/tour';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IOrder } from '../../models/order';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ToursService } from '../../services/tours.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderListService } from '../../services/order-list.service';

@Component({
  selector: 'app-order',
  imports: [MatInputModule, CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, RouterLink, NgTemplateOutlet, MatSnackBarModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  tour: ITour | null = null;
  order: IOrder | null = null;
  tourId: string = null;
  userForm: FormGroup;
  userFormFieldsArr = [
    { label: 'Имя', placeholder: 'Введите имя', control: 'firstname', type: 'text' },
    { label: 'Фамилия', placeholder: 'Введите фамилию', control: 'lastname', type: 'text' },
    { label: 'Возраст', placeholder: 'Укажите возраст', control: 'age', type: 'number' },
    { label: 'Дата рождения', placeholder: 'Укажите дату рождения', control: 'birthDate', type: 'date' },
    { label: 'Гражданство', placeholder: 'Введите гражданство', control: 'citizenship', type: 'text' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private orderListService: OrderListService,
    private tourItemService: TourItemService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.tourId = tourId;
      this.tourItemService.getTour(tourId).subscribe((tour) => {
        this.tour = tour;
      });
    }

    this.userForm = new FormGroup({
      firstname: new FormControl('', {validators: Validators.required}),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      birthDate: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      citizenship: new FormControl('',[Validators.required]),
    })
  }

  onSubmit(): void {
    const userId = localStorage.getItem('id');

    if (!userId) {
      this._snackBar.open('Для оформления заказа войдите в аккаунт', 'Войти', {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.router.navigate(['/auth']);
      return;
    }

    const { firstname, lastname, birthDate, age, citizenship } = this.userForm.getRawValue();
    const postObj = {
      firstname,
      lastname,
      birthDate,
      age: Number(age),
      citizenship,
      tourId: this.tourId,
      userId,
    };

    this.orderListService.postOrder(postObj).subscribe({
      next: () => {
        this._snackBar.open('Заказ успешно оформлен!', 'Закрыть', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this._snackBar.open('Ошибка при оформлении заказа. Попробуйте ещё раз.', 'Закрыть', {
          duration: null, // не закрываем сама — пусть пользователь увидит и закроет
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }
}