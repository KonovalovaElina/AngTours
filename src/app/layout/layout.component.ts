import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsideComponent } from './aside/aside.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ToursComponent } from '../pages/tours/tours.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    AsideComponent,
    HeaderComponent,
    FooterComponent,
    ToursComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
