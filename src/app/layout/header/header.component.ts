import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  username: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userData = this.userService.getUser();
    this.username = userData.login;
  }

}
