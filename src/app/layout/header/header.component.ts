import { Component, inject, NgZone, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './menu/menu.component';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Observable } from 'rxjs';
import { ITour } from '../../models/tour';
import { BasketService } from '../../services/basket.service';
@Component({
  selector: 'app-header',
  imports: [DatePipe, MenuComponent, MatButtonModule, OverlayBadgeModule, AsyncPipe],
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
  ) {}

  date = new Date();
  private ngZone = inject(NgZone);
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
    this.router.navigate(['/auth']);
  }
}
