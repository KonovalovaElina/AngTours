import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-header',
  imports: [DatePipe, MenuComponent, MatButtonModule],
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
    private router: Router
  ) {}
  date = new Date();

  ngOnInit(): void {
    const userData = this.userService.getUser();
    this.username = userData.login;
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  logout(): void {
    this.router.navigate(['/auth']);
  }
}
