import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourItemService } from '../../services/tour-item.service';
import { ITour } from '../../models/tour';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IOrder } from '../../models/order';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-order',
  imports: [MatInputModule, CommonModule, MatButtonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private tourItemService = inject(TourItemService);
  private router = inject(Router);
  private tourIdFromUrl: string | null = null;
  tour: ITour | null = null;
  order: IOrder | null = null;

  surname = '';
  name = '';
  email = '';

  isSubmitted = false;
  successMessage = '';


  ngOnInit(): void {
    const tourId = this.route.snapshot.queryParamMap.get('tourId');
    console.log('[Order] Получен tourId:', tourId, '(тип:', typeof tourId, ')');

    this.tourItemService.getTour(tourId).subscribe((data: any) => {
      this.tour = data;
    })
  }

  onSubmit(): void {
    if (!this.surname.trim() || !this.name.trim() || !this.email.trim()) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const orderData: IOrder = {
      tourId: this.tour.id,
      surname: this.surname.trim(),
      name: this.name.trim(),
      email: this.email.trim(),
    };

    console.log('Данные заказа:', orderData);

    // Эмуляция успешной отправки (убери setTimeout, если делаешь реальный запрос)
    setTimeout(() => {
      this.isSubmitted = true;
      this.successMessage = 'Спасибо! Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время.';
    }, 600);
  }
}