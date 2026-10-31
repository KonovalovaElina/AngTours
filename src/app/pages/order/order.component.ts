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

@Component({
  selector: 'app-order',
  imports: [MatInputModule, CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, RouterLink, NgTemplateOutlet],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  tour: ITour | null = null;
  order: IOrder | null = null;
  tourId: string = null;
  userForm: FormGroup;
  userFormFieldsArr = [
    { label: 'Имя', placeHolder: 'Введите имя', control: 'firstName', type: 'text' },
    { label: 'Фамилия', placeHolder: 'Введите фамилию', control: 'lastName', type: 'text' },
    { label: 'Возраст', placeHolder: 'Укажите возраст', control: 'age', type: 'number' },
    { label: 'Дата рождения', placeHolder: 'Укажите дату рождения', control: 'birthDate', type: 'date' },
    { label: 'Гражданство', placeHolder: 'Введите гражданство', control: 'citizenship', type: 'text' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private toursService: ToursService,
    private tourItemService: TourItemService,
    private userService: UserService,
    private router: Router
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
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      birthDate: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      citizenship: new FormControl('',[Validators.required]),
    })
  }

  onSubmit(): void {
    const userLogin = this.userService.getUser().login;
    const personalDate = this.userForm.getRawValue();
    const postObj = {
      userLogin,
      tourId: this.tourId,
      personalDate: [personalDate]
    }
    this.toursService.postOrder(postObj).subscribe();
  }
}