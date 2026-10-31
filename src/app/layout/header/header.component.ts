import { Component, inject, NgZone, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './menu/menu.component';
import { Observable } from 'rxjs';
import { ITour } from '../../models/tour';
import { BasketService } from '../../services/basket.service';
import { MatBadgeModule } from '@angular/material/badge';
@Component({
  selector: 'app-header',
  imports: [DatePipe, MenuComponent, MatButtonModule, AsyncPipe, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  menuItems = [
    {
      route: '',
      title: 'Главная'
    },
    {
      route: 'settings',
      title: 'Настройки'
    }
  ]

  username: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private basketService: BasketService,
    private ngZone: NgZone
  ) {}

  date = new Date();
  basketStore$: Observable<ITour[]> = null;

  ngOnInit(): void {
    this.basketStore$ = this.basketService.basketStore$;
    const userData = this.userService.getUser();
    this.username = userData?.login || '';
    this.ngZone.runOutsideAngular(() => {
      return setInterval(() => {
        this.date = new Date();
      }, 1000);
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/auth']);
  }

  goToBasket(): void {
    this.router.navigate(['/basket']);
  }
}
